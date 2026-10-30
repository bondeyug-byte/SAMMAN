// SAMMAN route scoring engine (ported from SAMMAN 4.0 scoring.js). Pure logic: no map, no screen.
// 1. Opening hours   2. Geometry   3. Sorting map data   4. Scoring a route
import { CONFIG } from './config';

export type LatLon = [number, number];
export type Tags = Record<string, string>;
export interface OsmElement {
  type: string;
  lat?: number;
  lon?: number;
  geometry?: { lat: number; lon: number }[];
  tags?: Tags;
}
export interface Step { dir: string; text: string; dist: string }
export interface RouteInput { coords: LatLon[]; duration?: number; steps?: Step[] }
export interface Place { name: string; lat: number; lon: number }
export interface Trip { from: Place; to: Place; routes: RouteInput[]; elements: OsmElement[] | null }

export interface Item { pt: LatLon; tags: Tags; state?: boolean | null; w?: number }
interface Line { pts: LatLon[]; s: number; n: number; w: number; e: number }
interface Grid { near(p: LatLon, r: number): Item[] }
export interface Prepared {
  places: Item[]; help: Item[]; transit: Item[]; cameras: Item[]; lamps: Item[];
  placeGrid: Grid; helpGrid: Grid; transitGrid: Grid; lampGrid: Grid;
  majorLines: Line[]; litLines: Line[]; unlitLines: Line[];
}
export interface Factor { id: string; label: string; max: number; points: number }
export interface Gap { len: number; pts: LatLon[] }
export interface Scored extends RouteInput {
  lengthM: number; duration: number; score: number | null; grade: string | null;
  factors: Factor[]; gaps: Gap[]; penalty: number;
  openCount: number; unknownCount: number; placeCount: number; lightKnownPct: number; helpNear: Item[];
  id: number; letter: string; isSafest: boolean; isFastest: boolean;
}

/* ---------- 1. Opening hours ----------
   Returns true (open), false (closed) or null (unknown). Unusual formats return null,
   so the app says "hours unknown" instead of guessing. */
const DAY_CODES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function dayInSelector(selector: string, dayIdx: number) {
  return selector.split(',').some((part) => {
    const [s, e] = part.split('-').map((d) => DAY_CODES.indexOf(d));
    if (s < 0 || (e !== undefined && e < 0)) throw new Error('bad day');
    if (e === undefined) return dayIdx === s;
    return s <= e ? dayIdx >= s && dayIdx <= e : dayIdx >= s || dayIdx <= e;
  });
}

export function isOpenAt(hours: string | undefined, when: Date): boolean | null {
  if (!hours) return null;
  const text = hours.trim();
  if (text === '24/7') return true;
  const dayIdx = (when.getDay() + 6) % 7;
  const mins = when.getHours() * 60 + when.getMinutes();
  let answer = false;
  let anyRule = false;
  try {
    for (let rule of text.split(';')) {
      rule = rule.trim();
      if (!rule || /^(PH|SH)\b/.test(rule)) continue; // holidays: skip
      const m = rule.match(/^([A-Z][a-z](?:[-,][A-Z][a-z])*)?\s*(.*)$/)!;
      anyRule = true;
      if (m[1] && !dayInSelector(m[1], dayIdx)) continue;
      const times = m[2].trim();
      if (/^(off|closed)$/i.test(times)) { answer = false; continue; }
      answer = times.split(',').some((range) => {
        const t = range.trim().match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})\+?$/);
        if (!t) throw new Error('bad time');
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

export function metres(a: LatLon, b: LatLon) {
  const k = Math.cos(((a[0] + b[0]) * Math.PI) / 360);
  return Math.hypot((b[0] - a[0]) * M_PER_DEG, (b[1] - a[1]) * M_PER_DEG * k);
}

export function lineLength(coords: LatLon[]) {
  let total = 0;
  for (let i = 1; i < coords.length; i++) total += metres(coords[i - 1], coords[i]);
  return total;
}

// Points every `step` metres along the route: these are the spots we check.
function resample(coords: LatLon[], step: number) {
  const pts: LatLon[] = [coords[0]];
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

function distToSegment(p: LatLon, a: LatLon, b: LatLon) {
  const k = Math.cos((p[0] * Math.PI) / 180);
  const ax = (a[1] - p[1]) * k * M_PER_DEG, ay = (a[0] - p[0]) * M_PER_DEG;
  const bx = (b[1] - p[1]) * k * M_PER_DEG, by = (b[0] - p[0]) * M_PER_DEG;
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / l2)) : 0;
  return Math.hypot(ax + t * dx, ay + t * dy);
}

// Lines get a bounding box so we can skip far-away roads quickly.
function prepLines(lines: LatLon[][]): Line[] {
  return lines.map((pts) => ({
    pts,
    s: Math.min(...pts.map((p) => p[0])), n: Math.max(...pts.map((p) => p[0])),
    w: Math.min(...pts.map((p) => p[1])), e: Math.max(...pts.map((p) => p[1])),
  }));
}

function nearLine(p: LatLon, lines: Line[], r: number) {
  const pad = (r / M_PER_DEG) * 1.2;
  return lines.some((L) => {
    if (p[0] < L.s - pad || p[0] > L.n + pad || p[1] < L.w - pad || p[1] > L.e + pad) return false;
    for (let i = 1; i < L.pts.length; i++) if (distToSegment(p, L.pts[i - 1], L.pts[i]) <= r) return true;
    return false;
  });
}

// A grid of ~400 m cells, so "what's near this point" stays fast.
function makeGrid(items: Item[], cell = 0.004): Grid {
  const grid = new Map<string, Item[]>();
  const key = (lat: number, lon: number) => `${Math.floor(lat / cell)},${Math.floor(lon / cell)}`;
  for (const it of items) {
    const k = key(it.pt[0], it.pt[1]);
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k)!.push(it);
  }
  return {
    near(p, r) {
      const out: Item[] = [];
      const cy = Math.floor(p[0] / cell), cx = Math.floor(p[1] / cell);
      for (let i = -1; i <= 1; i++)
        for (let j = -1; j <= 1; j++)
          for (const it of grid.get(`${cy + i},${cx + j}`) || []) if (metres(p, it.pt) <= r) out.push(it);
      return out;
    },
  };
}

/* ---------- 3. Sorting raw map data into what we score ---------- */
function centre(geometry: { lat: number; lon: number }[]): LatLon {
  const lat = geometry.reduce((s, g) => s + g.lat, 0) / geometry.length;
  const lon = geometry.reduce((s, g) => s + g.lon, 0) / geometry.length;
  return [lat, lon];
}

export function prepare(elements: OsmElement[], when: Date): Prepared {
  const d = { places: [] as Item[], help: [] as Item[], transit: [] as Item[], cameras: [] as Item[], lamps: [] as Item[], major: [] as LatLon[][], lit: [] as LatLon[][], unlit: [] as LatLon[][] };
  for (const el of elements) {
    const t = el.tags || {};
    const isWay = el.type === 'way' && !!el.geometry;
    const pt: LatLon | null = el.type === 'node' ? [el.lat!, el.lon!] : isWay ? centre(el.geometry!) : null;
    if (!pt) continue;
    const item: Item = { pt, tags: t };
    if (t.shop || /^(restaurant|cafe|fast_food)$/.test(t.amenity || '')) d.places.push(item);
    else if (/^(police|hospital|clinic|pharmacy|fuel)$/.test(t.amenity || '')) d.help.push(item);
    if (t.highway === 'bus_stop' || /^(station|halt)$/.test(t.railway || '')) d.transit.push(item);
    if (t.man_made === 'surveillance') d.cameras.push(item);
    if (t.highway === 'street_lamp') d.lamps.push(item);
    if (isWay) {
      const line = el.geometry!.map((g) => [g.lat, g.lon] as LatLon);
      if (/^(trunk|primary|secondary|tertiary)$/.test(t.highway || '')) d.major.push(line);
      if (['yes', '24/7', 'automatic'].includes(t.lit)) d.lit.push(line);
      if (t.lit === 'no') d.unlit.push(line);
    }
  }
  // Weight each place by whether it's open at the chosen time.
  for (const it of [...d.places, ...d.help]) {
    it.state = isOpenAt(it.tags.opening_hours, when);
    it.w = it.state === true ? 1
      : it.state === false ? 0
      : (CONFIG.alwaysOpen as readonly string[]).includes(it.tags.amenity) ? 1
      : CONFIG.unknownWeight;
  }
  return {
    places: d.places, help: d.help, transit: d.transit, cameras: d.cameras, lamps: d.lamps,
    placeGrid: makeGrid(d.places), helpGrid: makeGrid(d.help),
    transitGrid: makeGrid(d.transit), lampGrid: makeGrid(d.lamps),
    majorLines: prepLines(d.major), litLines: prepLines(d.lit), unlitLines: prepLines(d.unlit),
  };
}

/* ---------- 4. Scoring one route ---------- */
type Partial0 = Omit<Scored, 'id' | 'letter' | 'isSafest' | 'isFastest'>;

export function scoreRoute(route: RouteInput, data: Prepared): Partial0 {
  const C = CONFIG, R = C.radius;
  const samples = resample(route.coords, C.sampleStep);
  const lengthM = lineLength(route.coords);
  const n = samples.length;
  const placesSeen = new Set<Item>(), helpSeen = new Set<Item>();
  let helpSum = 0, onMain = 0, lit = 0, unlit = 0, nearTransit = 0;
  const covered: boolean[] = [];

  for (const p of samples) {
    data.placeGrid.near(p, R.place).forEach((x) => placesSeen.add(x));
    const helps = data.helpGrid.near(p, R.help);
    helps.forEach((x) => helpSeen.add(x));
    helpSum += Math.max(0, ...helps.map((h) => h.w ?? 0));
    if (nearLine(p, data.majorLines, R.mainRoad)) onMain++;
    if (data.lampGrid.near(p, R.light).length || nearLine(p, data.litLines, R.light)) lit++;
    else if (nearLine(p, data.unlitLines, R.light)) unlit++;
    if (data.transitGrid.near(p, R.transit).length) nearTransit++;
    covered.push(
      data.placeGrid.near(p, R.gapCover).some((x) => (x.w ?? 0) > 0) ||
      data.helpGrid.near(p, R.gapCover).some((x) => (x.w ?? 0) > 0),
    );
  }

  const places = [...placesSeen];
  const weightedOpen = places.reduce((s, x) => s + (x.w ?? 0), 0);
  const unknownLight = n - lit - unlit;
  const fraction: Record<string, number> = {
    openPlaces: Math.min(1, weightedOpen / Math.max(lengthM / 1000, 0.1) / C.openPlacesPerKmForFullMarks),
    helpPoints: helpSum / n,
    mainRoads: onMain / n,
    lighting: (lit + C.unknownWeight * unknownLight) / n,
    transit: nearTransit / n,
  };

  // Empty stretches: runs of samples with nothing open nearby.
  const gaps: Gap[] = [];
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
    gaps.reduce((s, g) => s + C.gap.basePenalty + ((g.len - C.gap.minMetres) / 100) * C.gap.penaltyPer100m, 0),
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
    grade: C.grades.find(([, min]) => score >= min)![0],
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

/** Grade every route; without place data, list routes ungraded rather than inventing grades. */
export function gradeTrip(trip: Trip, when: Date) {
  const graded = Array.isArray(trip.elements);
  const data: Prepared | null = graded ? prepare(trip.elements!, when) : null;
  const base: Partial0[] = graded
    ? trip.routes.map((r) => scoreRoute(r, data!)).sort((x, y) => (y.score ?? 0) - (x.score ?? 0))
    : trip.routes
        .map((r) => {
          const lengthM = lineLength(r.coords);
          return { ...r, lengthM, duration: r.duration ?? lengthM / CONFIG.walkingSpeed, score: null, grade: null,
            factors: [], gaps: [], helpNear: [], penalty: 0, openCount: 0, unknownCount: 0, placeCount: 0, lightKnownPct: 0 };
        })
        .sort((x, y) => x.duration - y.duration);
  const fastest = Math.min(...base.map((r) => r.duration));
  const scored: Scored[] = base.map((r, i) => ({
    ...r,
    id: i,
    letter: String.fromCharCode(65 + i),
    isSafest: graded && i === 0 && base.length > 1,
    isFastest: r.duration === fastest && base.length > 1,
  }));
  return { graded, data, scored };
}
