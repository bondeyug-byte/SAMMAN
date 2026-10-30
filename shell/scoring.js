/* ===== scoring.js ===== */
/* SAMMAN scoring engine. Pure logic: no map, no screen.
   1. Opening hours   2. Geometry   3. Sorting map data   4. Scoring a route */

/* ---------- 1. Opening hours ----------
   Returns true (open), false (closed) or null (unknown).
   Handles common OpenStreetMap formats like "24/7",
   "Mo-Sa 09:00-21:00; Su off". Anything unusual returns null,
   so the app says "hours unknown" instead of guessing. */
const DAY_CODES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function dayInSelector(selector, dayIdx) {
  return selector.split(",").some((part) => {
    const [s, e] = part.split("-").map((d) => DAY_CODES.indexOf(d));
    if (s < 0 || (e !== undefined && e < 0)) throw new Error("bad day");
    if (e === undefined) return dayIdx === s;
    return s <= e ? dayIdx >= s && dayIdx <= e : dayIdx >= s || dayIdx <= e;
  });
}

function isOpenAt(hours, when) {
  if (!hours) return null;
  const text = hours.trim();
  if (text === "24/7") return true;
  const dayIdx = (when.getDay() + 6) % 7;
  const mins = when.getHours() * 60 + when.getMinutes();
  let answer = false;
  let anyRule = false;
  try {
    for (let rule of text.split(";")) {
      rule = rule.trim();
      if (!rule || /^(PH|SH)\b/.test(rule)) continue; // holidays: skip
      const m = rule.match(/^([A-Z][a-z](?:[-,][A-Z][a-z])*)?\s*(.*)$/);
      anyRule = true;
      if (m[1] && !dayInSelector(m[1], dayIdx)) continue;
      const times = m[2].trim();
      if (/^(off|closed)$/i.test(times)) { answer = false; continue; }
      answer = times.split(",").some((range) => {
        const t = range.trim().match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})\+?$/);
        if (!t) throw new Error("bad time");
        const start = +t[1] * 60 + +t[2];
        const end = +t[3] * 60 + +t[4];
        // A range like 18:00-02:00 runs past midnight.
        return end > start ? mins >= start && mins < end : mins >= start || mins < end;
      });
    }
  } catch {
    return null;
  }
  return anyRule ? answer : null;
}

/* ---------- 2. Geometry (city-scale, in metres) ---------- */
const M_PER_DEG = 111320;

function metres(a, b) {
  const k = Math.cos(((a[0] + b[0]) * Math.PI) / 360);
  return Math.hypot((b[0] - a[0]) * M_PER_DEG, (b[1] - a[1]) * M_PER_DEG * k);
}

function lineLength(coords) {
  let total = 0;
  for (let i = 1; i < coords.length; i++) total += metres(coords[i - 1], coords[i]);
  return total;
}

// Points every `step` metres along the route: these are the spots we check.
function resample(coords, step) {
  const pts = [coords[0]];
  let carry = 0;
  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1], b = coords[i], len = metres(a, b);
    let d = step - carry;
    while (d <= len) {
      const f = d / len;
      pts.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
      d += step;
    }
    carry = len - (d - step);
  }
  return pts;
}

function distToSegment(p, a, b) {
  const k = Math.cos((p[0] * Math.PI) / 180);
  const ax = (a[1] - p[1]) * k * M_PER_DEG, ay = (a[0] - p[0]) * M_PER_DEG;
  const bx = (b[1] - p[1]) * k * M_PER_DEG, by = (b[0] - p[0]) * M_PER_DEG;
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / l2)) : 0;
  return Math.hypot(ax + t * dx, ay + t * dy);
}

// Lines get a bounding box so we can skip far-away roads quickly.
function prepLines(lines) {
  return lines.map((pts) => ({
    pts,
    s: Math.min(...pts.map((p) => p[0])), n: Math.max(...pts.map((p) => p[0])),
    w: Math.min(...pts.map((p) => p[1])), e: Math.max(...pts.map((p) => p[1])),
  }));
}

function nearLine(p, lines, r) {
  const pad = (r / M_PER_DEG) * 1.2;
  return lines.some((L) => {
    if (p[0] < L.s - pad || p[0] > L.n + pad || p[1] < L.w - pad || p[1] > L.e + pad) return false;
    for (let i = 1; i < L.pts.length; i++) if (distToSegment(p, L.pts[i - 1], L.pts[i]) <= r) return true;
    return false;
  });
}

// A grid of ~400 m cells, so "what's near this point" stays fast.
function makeGrid(items, cell = 0.004) {
  const grid = new Map();
  const key = (lat, lon) => `${Math.floor(lat / cell)},${Math.floor(lon / cell)}`;
  for (const it of items) {
    const k = key(it.pt[0], it.pt[1]);
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(it);
  }
  return {
    near(p, r) {
      const out = [];
      const cy = Math.floor(p[0] / cell), cx = Math.floor(p[1] / cell);
      for (let i = -1; i <= 1; i++)
        for (let j = -1; j <= 1; j++)
          for (const it of grid.get(`${cy + i},${cx + j}`) || [])
            if (metres(p, it.pt) <= r) out.push(it);
      return out;
    },
  };
}

/* ---------- 3. Sorting raw map data into what we score ---------- */
function centre(geometry) {
  const lat = geometry.reduce((s, g) => s + g.lat, 0) / geometry.length;
  const lon = geometry.reduce((s, g) => s + g.lon, 0) / geometry.length;
  return [lat, lon];
}

function prepare(elements, when) {
  const d = { places: [], help: [], transit: [], cameras: [], lamps: [], major: [], lit: [], unlit: [] };
  for (const el of elements) {
    const t = el.tags || {};
    const isWay = el.type === "way" && el.geometry;
    const pt = el.type === "node" ? [el.lat, el.lon] : isWay ? centre(el.geometry) : null;
    if (!pt) continue;
    const item = { pt, tags: t };
    if (t.shop || /^(restaurant|cafe|fast_food)$/.test(t.amenity)) d.places.push(item);
    else if (/^(police|hospital|clinic|pharmacy|fuel)$/.test(t.amenity)) d.help.push(item);
    if (t.highway === "bus_stop" || /^(station|halt)$/.test(t.railway)) d.transit.push(item);
    if (t.man_made === "surveillance") d.cameras.push(item);
    if (t.highway === "street_lamp") d.lamps.push(item);
    if (isWay) {
      const line = el.geometry.map((g) => [g.lat, g.lon]);
      if (/^(trunk|primary|secondary|tertiary)$/.test(t.highway)) d.major.push(line);
      if (["yes", "24/7", "automatic"].includes(t.lit)) d.lit.push(line);
      if (t.lit === "no") d.unlit.push(line);
    }
  }
  // Weight each place by whether it's open at the chosen time.
  for (const it of [...d.places, ...d.help]) {
    it.state = isOpenAt(it.tags.opening_hours, when);
    it.w = it.state === true ? 1
      : it.state === false ? 0
      : CONFIG.alwaysOpen.includes(it.tags.amenity) ? 1
      : CONFIG.unknownWeight;
  }
  return {
    ...d,
    placeGrid: makeGrid(d.places), helpGrid: makeGrid(d.help),
    transitGrid: makeGrid(d.transit), lampGrid: makeGrid(d.lamps),
    majorLines: prepLines(d.major), litLines: prepLines(d.lit), unlitLines: prepLines(d.unlit),
  };
}

/* ---------- 4. Scoring one route ---------- */
function scoreRoute(route, data) {
  const C = CONFIG, R = C.radius;
  const samples = resample(route.coords, C.sampleStep);
  const lengthM = lineLength(route.coords);
  const n = samples.length;
  const placesSeen = new Set(), helpSeen = new Set();
  let helpSum = 0, onMain = 0, lit = 0, unlit = 0, nearTransit = 0;
  const covered = [];

  for (const p of samples) {
    data.placeGrid.near(p, R.place).forEach((x) => placesSeen.add(x));
    const helps = data.helpGrid.near(p, R.help);
    helps.forEach((x) => helpSeen.add(x));
    helpSum += Math.max(0, ...helps.map((h) => h.w));
    if (nearLine(p, data.majorLines, R.mainRoad)) onMain++;
    if (data.lampGrid.near(p, R.light).length || nearLine(p, data.litLines, R.light)) lit++;
    else if (nearLine(p, data.unlitLines, R.light)) unlit++;
    if (data.transitGrid.near(p, R.transit).length) nearTransit++;
    covered.push(
      data.placeGrid.near(p, R.gapCover).some((x) => x.w > 0) ||
      data.helpGrid.near(p, R.gapCover).some((x) => x.w > 0)
    );
  }

  const places = [...placesSeen];
  const weightedOpen = places.reduce((s, x) => s + x.w, 0);
  const unknownLight = n - lit - unlit;
  const fraction = {
    openPlaces: Math.min(1, weightedOpen / Math.max(lengthM / 1000, 0.1) / C.openPlacesPerKmForFullMarks),
    helpPoints: helpSum / n,
    mainRoads: onMain / n,
    lighting: (lit + C.unknownWeight * unknownLight) / n,
    transit: nearTransit / n,
  };

  // Empty stretches: runs of samples with nothing open nearby.
  const gaps = [];
  let runStart = -1;
  [...covered, true].forEach((ok, i) => {
    if (!ok && runStart < 0) runStart = i;
    if (ok && runStart >= 0) {
      const len = (i - runStart) * C.sampleStep;
      if (len >= C.gap.minMetres) gaps.push({ len, pts: samples.slice(runStart, i) });
      runStart = -1;
    }
  });
  const penalty = Math.min(
    C.gap.maxPenalty,
    gaps.reduce((s, g) => s + C.gap.basePenalty + ((g.len - C.gap.minMetres) / 100) * C.gap.penaltyPer100m, 0)
  );

  const factors = C.factors.map((f) => ({ ...f, points: Math.round(fraction[f.id] * f.max * 10) / 10 }));
  const maxTotal = C.factors.reduce((s, f) => s + f.max, 0);
  const earned = factors.reduce((s, f) => s + f.points, 0);
  const score = Math.max(0, Math.round(((earned - penalty) / maxTotal) * 100));

  return {
    ...route,
    lengthM,
    duration: route.duration ?? lengthM / C.walkingSpeed,
    score,
    grade: C.grades.find(([, min]) => score >= min)[0],
    factors,
    gaps,
    penalty: Math.round(penalty * 10) / 10,
    openCount: places.filter((x) => x.state === true).length,
    unknownCount: places.filter((x) => x.state === null).length,
    placeCount: places.length,
    lightKnownPct: Math.round(((lit + unlit) / n) * 100),
    helpNear: [...helpSeen],
  };
}

