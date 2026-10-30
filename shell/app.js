/* ===== app.js ===== */
"use strict";
/* SAMMAN app: screens, map and buttons.
   1. Helpers   2. Navigation   3. Help sheet, SOS and menu   4. Map
   5. Live data   6. Planning a trip   7. Compare   8. Details
   9. Emergency, How and Learn   10. Start-up */

/* ---------- 1. Helpers ---------- */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const INK = { chosen: "#1f4535", other: "#8f897d", gap: "#ba3844", help: "#315e4a" };
const minutes = (s) => `${Math.round(s / 60)} min`;
const km = (m) => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`);

let toastTimer;
function toast(msg) {
  $("toast").textContent = msg;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2600);
}

/* ---------- 2. Navigation ---------- */
const VIEWS = ["home", "learn", "plan", "compare", "details", "emergency", "how"];
const GUIDE = ["plan", "compare", "details"];
let current = "home", lastGuide = "plan";
let state = null, myLocation = null;
let learnLoaded = false; // declared early so Learn works even if a later step fails
if (!document.startViewTransition) document.documentElement.classList.add("no-vt");

function show(view, focusId) {
  if (view === "guide") view = lastGuide;
  if ((view === "compare" || view === "details") && !state) view = "plan";
  if (view === "details" && state.selectedId == null) view = "compare";
  if (GUIDE.includes(view)) lastGuide = view;

  const swap = () => {
    current = view;
    for (const v of VIEWS) $(`view-${v}`).hidden = v !== view;
    document.querySelectorAll(".tabbar [data-tab]").forEach((b) => {
      const on = b.dataset.tab === "guide" ? GUIDE.includes(view) : b.dataset.tab === view;
      b.setAttribute("aria-current", on ? "page" : "false");
    });
    if (view === "compare" || view === "details") {
      $(`${view}-map-slot`).appendChild($("map-box")); // one map, moved between screens
      styleMap();
    }
    window.scrollTo(0, 0);
  };
  const after = () => {
    if (map && (view === "compare" || view === "details")) {
      map.invalidateSize();
      watchTiles();
      userMoved = false;
      fitView();
    }
    if (view === "learn") ensureLearn();
    if (focusId) {
      const el = $(focusId);
      el.scrollIntoView({ block: "center", behavior: reducedMotion() ? "auto" : "smooth" });
      el.focus?.({ preventScroll: true });
    }
  };
  if (document.startViewTransition && !reducedMotion()) document.startViewTransition(swap).finished.then(after);
  else { swap(); requestAnimationFrame(after); }
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-nav]");
  if (!b) return;
  b.closest("dialog")?.close();
  show(b.dataset.nav, b.dataset.focus);
});

/* ---------- 3. Help sheet, SOS and menu ---------- */
const sheet = $("sos-sheet"), menu = $("menu");
function openSheet() {
  $("sheet-msg").textContent = "";
  if (!sheet.open) sheet.showModal();
}
$("help-btn").addEventListener("click", openSheet);
$("sheet-close").addEventListener("click", () => sheet.close());
$("menu-btn").addEventListener("click", () => menu.showModal());
$("menu-close").addEventListener("click", () => menu.close());
// Tapping the dimmed area outside a dialog closes it.
for (const d of [sheet, menu]) {
  d.addEventListener("click", (e) => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  });
}

// SOS: press and hold for 3 seconds, so it can't fire from a pocket.
const HOLD_MS = 3000;
function makeHold(btn, onDone) {
  let start = 0, raf = 0;
  const reset = () => { cancelAnimationFrame(raf); raf = 0; btn.classList.remove("holding"); btn.style.setProperty("--p", 0); };
  const tick = (now) => {
    const p = Math.min(1, (now - start) / HOLD_MS);
    btn.style.setProperty("--p", p);
    if (p >= 1) { reset(); onDone(); } else raf = requestAnimationFrame(tick);
  };
  const begin = (e) => {
    if (raf) return;
    e.preventDefault();
    start = performance.now();
    btn.classList.add("holding");
    raf = requestAnimationFrame(tick);
  };
  const cancel = () => { if (!raf) return; reset(); toast("Keep holding for 3 seconds to open SOS options."); };
  btn.addEventListener("pointerdown", begin);
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => btn.addEventListener(ev, cancel));
  btn.addEventListener("keydown", (e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) begin(e); });
  btn.addEventListener("keyup", (e) => { if (e.key === " " || e.key === "Enter") cancel(); });
  btn.addEventListener("contextmenu", (e) => e.preventDefault());
}
document.querySelectorAll(".hold").forEach((b) => makeHold(b, () => { navigator.vibrate?.(150); openSheet(); }));

// Why did location fail? Say the real reason, and never leave her without a next step.
function geoMessage(err) {
  const onWeb = location.protocol === "https:" || location.hostname === "localhost";
  const hint = onWeb ? "" : " This page isn't a secure website (for example, it was opened from WhatsApp or a downloaded file). Open SAMMAN from its website instead.";
  if (!navigator.geolocation) return "This browser can't share location." + hint;
  if (err?.code === 1) return "Location is blocked for this page. Allow location in your browser's site settings and try again." + hint;
  if (err?.code === 2) return "Your phone couldn't work out where you are. Check that Location is switched on, or step outside, then try again." + hint;
  if (err?.code === 3) return "Finding your location took too long. Try again." + hint;
  return "Couldn't get your location." + hint;
}

// Share location: she chooses who gets it, in her phone's own share menu.
function shareText(text, say, done) {
  return (async () => {
    try {
      if (navigator.share) { await navigator.share({ text }); say(done); }
      else { await navigator.clipboard.writeText(text); say("Copied. Paste it into a message to someone you trust."); }
    } catch { say("Sharing was cancelled, so nothing was sent."); }
  })();
}
function shareLocation(say, plainBtn) {
  plainBtn.hidden = true;
  const fail = (msg) => { say(`${msg} You can still call 112 or 181.`); plainBtn.hidden = false; };
  if (!navigator.geolocation) return fail(geoMessage(null));
  say("Getting your location…");
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude.toFixed(5), lon = pos.coords.longitude.toFixed(5);
    shareText(`I need help. My location: https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`, say, "Location shared.");
  }, (err) => fail(geoMessage(err)), { enableHighAccuracy: true, timeout: 10000 });
}
const PLAIN_HELP = "I need help. I couldn't share my location. Please call me.";
$("sheet-share").addEventListener("click", () => shareLocation((m) => { $("sheet-msg").textContent = m; }, $("sheet-plain")));
$("em-share").addEventListener("click", () => shareLocation((m) => { $("em-msg").textContent = m; }, $("em-plain")));
$("sheet-plain").addEventListener("click", () => shareText(PLAIN_HELP, (m) => { $("sheet-msg").textContent = m; }, "Message shared."));
$("em-plain").addEventListener("click", () => shareText(PLAIN_HELP, (m) => { $("em-msg").textContent = m; }, "Message shared."));

/* ---------- 4. Map ---------- */
// If the map library can't start, everything else (Learn, Emergency, grading) still works.
let map = null, layers = null;
try {
  map = L.map("map", { zoomControl: false }).setView([19.2, 72.97], 13);
  map.attributionControl.setPosition("bottomleft");
  layers = { routes: L.layerGroup().addTo(map), detail: L.layerGroup().addTo(map), cameras: L.layerGroup() };
} catch (err) {
  console.warn("Map unavailable:", err);
  map = null;
  $("map").hidden = true;
  $("map-note").textContent = "The map couldn't start in this browser, so routes are listed without a map. Grades still work.";
  $("map-note").hidden = false;
}

// Street pictures: CARTO first, then OpenStreetMap. If neither loads, say so plainly.
const OSM_CREDIT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const TILE_SOURCES = [
  ...(CONFIG.cartoKey ? [{
    url: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CONFIG.cartoKey}`,
    options: { subdomains: "abcd", attribution: `${OSM_CREDIT} &copy; <a href="https://carto.com/attributions">CARTO</a>` },
  }] : []),
  { url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png", options: { attribution: OSM_CREDIT } },
];
let tiles = null, tileIndex = 0, tileLoaded = 0, tileFailed = 0, tileWatch = 0;
function useTiles(i) {
  if (!map) return;
  if (tiles) map.removeLayer(tiles);
  tileIndex = i; tileLoaded = 0; tileFailed = 0;
  const layer = L.tileLayer(TILE_SOURCES[i].url, { maxZoom: 19, ...TILE_SOURCES[i].options });
  layer.on("tileload", () => { if (layer === tiles) { tileLoaded++; $("map-note").hidden = true; } });
  layer.on("tileerror", () => { if (layer === tiles && ++tileFailed >= 4 && tileLoaded === 0) nextTiles(); });
  tiles = layer.addTo(map);
  layer.bringToBack();
  watchTiles();
}
function nextTiles() {
  if (tileIndex + 1 < TILE_SOURCES.length) useTiles(tileIndex + 1);
  else $("map-note").hidden = false;
}
// Some networks hang instead of refusing, so also give up after 8 seconds.
function watchTiles() {
  clearTimeout(tileWatch);
  if (!map) return;
  if (current !== "compare" && current !== "details") return;
  const layer = tiles;
  tileWatch = setTimeout(() => { if (layer === tiles && tileLoaded === 0) nextTiles(); }, 8000);
}
useTiles(0);

// Keep the routes in view when the phone's layout shifts, until she moves the map.
let userMoved = false;
if (map) {
  map.on("dragstart", () => { userMoved = true; });
  if (window.ResizeObserver) new ResizeObserver(() => { map.invalidateSize(); if (!userMoved) fitView(); }).observe($("map"));
}

const selected = () => state?.scored.find((r) => r.id === state.selectedId);
function fitView() {
  if (!map || !state || (current !== "compare" && current !== "details")) return;
  const routes = current === "details" && selected() ? [selected()] : state.scored;
  map.fitBounds(L.latLngBounds(routes.flatMap((r) => r.coords)), { padding: [28, 28] });
}

function drawTrip() {
  if (!map) return;
  const { trip, scored } = state;
  const pin = (html, cls) => L.divIcon({ className: "", html: `<span class="pin ${cls}">${html}</span>`, iconSize: [26, 26], iconAnchor: [13, 13] });
  L.marker([trip.from.lat, trip.from.lon], { icon: pin("", "") }).bindTooltip(`Start: ${esc(trip.from.name)}`).addTo(layers.routes);
  L.marker([trip.to.lat, trip.to.lon], { icon: pin("", "pin-end") }).bindTooltip(`End: ${esc(trip.to.name)}`).addTo(layers.routes);
  for (const r of scored) {
    r.line = L.polyline(r.coords, { color: INK.other, weight: 5, opacity: 0.75 })
      .bindTooltip(`Route ${r.letter}, grade ${r.grade}`)
      .on("click", () => { if (current === "compare") pick(r.id); })
      .addTo(layers.routes);
  }
}

// Compare shows every route; Details shows only the chosen one, with its gaps and help points.
function styleMap() {
  if (!map || !state) return;
  layers.detail.clearLayers();
  for (const r of state.scored) {
    const chosen = r.id === state.selectedId;
    if (current === "details" && !chosen) { r.line.setStyle({ opacity: 0 }); continue; }
    r.line.setStyle({ color: chosen ? INK.chosen : INK.other, weight: chosen ? 7 : 5, opacity: chosen ? 1 : 0.75 });
    if (chosen) r.line.bringToFront();
  }
  if (current === "details" && selected()) drawDetailLayers(selected());
}

function drawDetailLayers(r) {
  for (const g of r.gaps) {
    L.polyline(g.pts, { color: INK.gap, weight: 12, opacity: 0.45, dashArray: "2 10", lineCap: "round" })
      .bindTooltip(`Empty stretch, ${km(g.len)}: nothing open nearby`).addTo(layers.detail);
  }
  const NAME = { police: "Police", hospital: "Hospital", clinic: "Clinic", pharmacy: "Chemist", fuel: "Petrol pump" };
  for (const h of r.helpNear) {
    const hours = h.state === true ? "open then" : h.state === false ? "closed then"
      : CONFIG.alwaysOpen.includes(h.tags.amenity) ? "usually open all night (assumed)" : "hours not listed";
    L.circleMarker(h.pt, { radius: 7, color: "#fff", weight: 2, fillColor: INK.help, fillOpacity: 1 })
      .bindTooltip(`${esc(h.tags.name || NAME[h.tags.amenity])}, ${hours}`).addTo(layers.detail);
  }
}

function drawCameras() {
  if (!map) return;
  for (const c of state.data.cameras) {
    L.circleMarker(c.pt, { radius: 4, color: "#5f5a50", weight: 1, fillColor: "#5f5a50", fillOpacity: 0.8 })
      .bindTooltip("CCTV camera, as mapped by OpenStreetMap volunteers").addTo(layers.cameras);
  }
}
$("cam-toggle").addEventListener("change", (e) => {
  if (!map) return;
  if (e.target.checked) layers.cameras.addTo(map); else layers.cameras.remove();
});

/* ---------- 5. Live data (free, from OpenStreetMap) ---------- */
async function getJSON(url, options = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CONFIG.timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    if (!res.ok) throw new Error(`${new URL(url).host} replied ${res.status}`);
    return await res.json();
  } catch (err) {
    throw new Error(err.name === "AbortError" ? `${new URL(url).host} took too long` : err.message);
  } finally {
    clearTimeout(timer);
  }
}

async function geocode(text) {
  const params = new URLSearchParams({ q: text, format: "jsonv2", limit: "1", countrycodes: "in", viewbox: "72.75,19.35,73.15,18.85" });
  const [hit] = await getJSON(`https://nominatim.openstreetmap.org/search?${params}`);
  if (!hit) return null;
  return { name: hit.display_name.split(",").slice(0, 2).join(","), lat: +hit.lat, lon: +hit.lon };
}

// Turn the router's raw steps into short, readable directions.
function buildSteps(raw) {
  const out = [];
  for (const s of raw) {
    const m = s.maneuver, name = s.name || "the path", mod = m.modifier || "";
    let dir = "up", text;
    if (m.type === "depart") text = `Start on ${name}`;
    else if (m.type === "arrive") { dir = "flag"; text = "Arrive at your destination"; }
    else if (mod.includes("left") || mod.includes("right")) {
      dir = mod.includes("left") ? "left" : "right";
      text = `${mod.startsWith("slight") ? "Bear" : "Turn"} ${dir} onto ${name}`;
    } else text = `Continue on ${name}`;
    const prev = out[out.length - 1];
    if (prev && dir === "up" && prev.text.endsWith(name)) { prev.metres += s.distance; continue; }
    out.push({ dir, text, metres: s.distance });
  }
  return out.map((s) => ({ dir: s.dir, text: s.text, dist: s.dir === "flag" ? "" : km(s.metres) }));
}

async function fetchRoutes(a, b) {
  const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=full&geometries=geojson&alternatives=3&steps=true`;
  const data = await getJSON(url);
  if (data.code !== "Ok" || !data.routes?.length) throw new Error("no walking route was found");
  return data.routes.map((r) => ({
    duration: r.duration,
    coords: r.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    steps: buildSteps(r.legs.flatMap((l) => l.steps)),
  }));
}

// Bounding box of [lat, lon] points (no map library needed).
function boundsOf(pts) {
  const lats = pts.map((p) => p[0]), lons = pts.map((p) => p[1]);
  return { s: Math.min(...lats), n: Math.max(...lats), w: Math.min(...lons), e: Math.max(...lons) };
}

async function fetchPlaces(bounds) {
  const padLat = (bounds.n - bounds.s) * 0.15, padLon = (bounds.e - bounds.w) * 0.15;
  const box = [bounds.s - padLat, bounds.w - padLon, bounds.n + padLat, bounds.e + padLon].map((x) => x.toFixed(5)).join(",");
  const query = `[out:json][timeout:25][bbox:${box}];
(
  node[shop];
  node[amenity~"^(restaurant|cafe|fast_food|police|hospital|clinic|pharmacy|fuel)$"];
  way[amenity~"^(police|hospital|clinic|fuel)$"];
  node[highway=bus_stop]; node[railway~"^(station|halt)$"];
  node[man_made=surveillance]; node[highway=street_lamp];
  way[highway~"^(trunk|primary|secondary|tertiary)$"];
  way[highway][lit];
);
out geom;`;
  const errors = [];
  for (let i = 0; i < CONFIG.overpassServers.length; i++) {
    if (i > 0) { planStatus("That server is busy, trying another…"); }
    try {
      const data = await getJSON(CONFIG.overpassServers[i], { method: "POST", body: new URLSearchParams({ data: query }) });
      return { elements: data.elements, backup: i > 0 };
    } catch (err) {
      console.warn(err);
      errors.push(err.message);
    }
  }
  throw new Error(errors.join("; "));
}

/* ---------- 6. Planning a trip ---------- */
const planStatus = (m) => { $("plan-status").textContent = m; };
const banner = (m) => { $("banner").hidden = !m; $("banner").textContent = m || ""; };

function chosenTime() {
  const [h, m] = ($("when").value || "00:00").split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}
const whenLabel = (d) => `Today, ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;

const BACKUP_NOTE = "Graded using a backup server for nearby places. Its map data may be a few months old.";

function presentTrip(trip, when, notice) {
  if (map) { layers.routes.clearLayers(); layers.detail.clearLayers(); layers.cameras.clearLayers(); }
  const graded = Array.isArray(trip.elements); // no place data means we can't grade, and we don't invent grades
  const data = graded ? prepare(trip.elements, when) : { cameras: [] };
  const scored = graded
    ? trip.routes.map((r) => scoreRoute(r, data)).sort((x, y) => y.score - x.score)
    : trip.routes.map((r) => {
        const lengthM = lineLength(r.coords);
        return { ...r, lengthM, duration: r.duration ?? lengthM / CONFIG.walkingSpeed, score: null, grade: null,
                 factors: [], gaps: [], helpNear: [], penalty: 0, openCount: 0, unknownCount: 0, placeCount: 0, lightKnownPct: 0 };
      }).sort((x, y) => x.duration - y.duration);
  const fastest = Math.min(...scored.map((r) => r.duration));
  scored.forEach((r, i) => {
    r.id = i;
    r.letter = String.fromCharCode(65 + i);
    r.isSafest = graded && i === 0 && scored.length > 1;
    r.isFastest = r.duration === fastest && scored.length > 1;
  });
  state = { trip, data, scored, when, graded, isSample: trip === SAMPLE, selectedId: null }; // she picks; nothing is pre-selected
  banner(notice);
  $("retry-btn").hidden = graded || state.isSample;
  drawTrip();
  drawCameras();
  renderCompare();
  show("compare");
}

async function planTrip(fromText, toText) {
  const when = chosenTime();
  const btn = $("find-btn");
  btn.disabled = true;
  btn.textContent = "Finding routes…";
  try {
    let a, b, routes;
    try {
      planStatus("Finding the two places…");
      a = fromText === "My location" && myLocation ? myLocation : await geocode(fromText);
      b = await geocode(toText);
      if (!a || !b) return planStatus(`Couldn't find "${!a ? fromText : toText}". Try adding the area, like "Naupada, Thane".`);
      planStatus("Finding walking routes…");
      routes = await fetchRoutes(a, b);
    } catch (err) {
      console.warn(err);
      return planStatus(`Couldn't reach the map services (${err.message}). Check your connection and try again, or try a sample trip.`);
    }
    planStatus("Checking what's along each route…");
    let elements = null, notice = "";
    try {
      const res = await fetchPlaces(boundsOf(routes.flatMap((r) => r.coords)));
      elements = res.elements;
      if (res.backup) notice = BACKUP_NOTE;
    } catch (err) {
      notice = `We found walking routes, but couldn't load nearby places to grade them (${err.message}). Routes are shown without grades.`;
    }
    planStatus("");
    presentTrip({ from: a, to: b, routes, elements }, when, notice);
  } finally {
    btn.disabled = false;
    btn.textContent = "Compare routes";
  }
}

async function retryGrading() {
  if (!state || state.graded || state.isSample) return;
  const btns = [...document.querySelectorAll("[data-retry]")];
  btns.forEach((b) => { b.disabled = true; b.textContent = "Grading…"; });
  try {
    const res = await fetchPlaces(boundsOf(state.trip.routes.flatMap((r) => r.coords)));
    presentTrip({ ...state.trip, elements: res.elements }, state.when, res.backup ? BACKUP_NOTE : "");
    toast("Routes graded.");
  } catch (err) {
    console.warn(err);
    banner(`Still couldn't load nearby places (${err.message}). The free public map servers are busy. Please try again in a minute.`);
    toast("Still couldn't grade. Try again in a minute.");
    btns.forEach((b) => { b.disabled = false; b.textContent = "Try grading again"; });
  }
}
document.addEventListener("click", (e) => { if (e.target.closest("[data-retry]")) retryGrading(); });

/* ---------- 7. Compare ---------- */
const WAYS = ["", "One way", "Two ways", "Three ways", "Four ways", "Five ways"];
function renderCompare() {
  const { scored, when, isSample, trip } = state;
  $("compare-title").textContent = `${WAYS[scored.length] || `${scored.length} ways`} to get there`;
  $("compare-when").textContent = `${whenLabel(when)}. ${isSample ? "Sample trip." : `${trip.from.name} to ${trip.to.name}.`}`;
  const close = state.graded && scored.length > 1 && scored[0].score - scored[1].score <= CONFIG.closeCall;
  $("close-call").hidden = !close;
  if (close) $("close-call").textContent = `Close call: routes ${scored[0].letter} and ${scored[1].letter} score ${scored[0].score} and ${scored[1].score}. Check the details of both.`;
  $("route-list").innerHTML = scored.map((r) => `
    <label class="route-opt">
      <input type="radio" name="route" value="${r.id}">
      ${state.graded ? `<span class="grade grade-${r.grade}" aria-label="Grade ${r.grade}">${r.grade}</span>`
                     : `<span class="grade grade-none" aria-label="Not graded">–</span>`}
      <span class="ro-main">
        <span><strong>Route ${r.letter}</strong>${r.isSafest ? '<span class="tag tag-safe">Safest</span>' : ""}${r.isFastest ? '<span class="tag tag-fast">Fastest</span>' : ""}</span>
        <span class="meta">${minutes(r.duration)} · ${km(r.lengthM)} · ${state.graded ? `score ${r.score}` : "not graded"}</span>
        ${r.gaps.length ? `<span class="warn">${r.gaps.length === 1 ? "1 empty stretch" : `${r.gaps.length} empty stretches`}, longest ${km(Math.max(...r.gaps.map((g) => g.len)))}</span>` : ""}
      </span>
    </label>`).join("");
  $("illustrative-routes").hidden = !isSample;
  updateDetailsBtn();
}
$("route-list").addEventListener("change", (e) => pick(+e.target.value));

function pick(id) {
  state.selectedId = id;
  const input = $("route-list").querySelector(`input[value="${id}"]`);
  if (input) input.checked = true;
  styleMap();
  updateDetailsBtn();
}
function updateDetailsBtn() {
  const r = selected();
  $("details-btn").disabled = !r;
  $("details-btn").textContent = r ? `See route ${r.letter} details` : "Pick a route to see details";
}
$("details-btn").addEventListener("click", () => { renderDetails(); show("details"); });

/* ---------- 8. Details ---------- */
function renderDetails() {
  const r = selected();
  const plural = (n, one, many) => (n === 1 ? one : many);
  $("details-sub").textContent = `${minutes(r.duration)} · ${km(r.lengthM)} · ${state.graded ? `grade ${r.grade}, score ${r.score} of 100` : "not graded"}`;
  $("why").innerHTML = `
    <h2>Why grade ${r.grade}</h2>
    <ul class="factors">
      ${r.factors.map((f) => `
        <li>
          <div class="factor-top"><span>${esc(f.label)}</span><span>${f.points} of ${f.max}</span></div>
          <div class="bar"><span style="width:${(f.points / f.max) * 100}%"></span></div>
        </li>`).join("")}
    </ul>
    <p class="fine">
      ${r.gaps.length ? `Empty stretches take off ${r.penalty} points. ` : ""}
      ${r.openCount} of ${r.placeCount} places along the way are open then;
      ${r.unknownCount} ${plural(r.unknownCount, "doesn't", "don't")} list ${plural(r.unknownCount, "its", "their")} hours.
      Lighting is mapped for ${r.lightKnownPct}% of this route.
    </p>`;
  if (!state.graded) {
    $("why").innerHTML = `
      <h2>Not graded</h2>
      <p>We couldn't load the nearby places needed to grade this route, so there's no grade to show. The route and directions below are real.</p>
      <button class="btn-outline" data-retry>Try grading again</button>`;
  }
  const steps = r.steps || [];
  $("directions").innerHTML = steps.length
    ? steps.map((s) => `<li><svg><use href="#i-${s.dir}"/></svg><span>${esc(s.text)}</span><small>${esc(s.dist || "")}</small></li>`).join("")
    : "<li><span>Directions aren't available for this route.</span></li>";
  $("illustrative-dirs").hidden = !state.isSample;
}

/* ---------- 9. Emergency, How and Learn (all read config.js) ---------- */
function renderDirectory() {
  const groups = [...new Set(HELP_DIRECTORY.map((e) => e.group))];
  $("directory").innerHTML = `
    <p class="fine">Only numbers confirmed from an official or operator source are listed. Check them again before relying on them.</p>
    ${groups.map((g) => `
      <h3>${esc(g)}</h3>
      ${HELP_DIRECTORY.filter((e) => e.group === g).map((e) => `
        <div class="entry">
          <h4>${esc(e.name)}</h4>
          <p>${esc(e.purpose)}</p>
          <div class="contacts">${e.contacts.map((c) => c.dial
            ? `<a href="tel:${c.dial}">${esc(c.label)}</a>`
            : `<a href="${c.url}" target="_blank" rel="noopener">${esc(c.label)}</a>`).join("")}</div>
          <p class="fine">Source: ${esc(e.source)}.${e.note ? ` ${esc(e.note)}` : ""}</p>
        </div>`).join("")}`).join("")}
    <h3>Online harassment and consent</h3>
    <p>The <button class="link" style="display:inline;margin:0;padding:0" data-nav="learn">Learn</button> section covers deepfakes, image sharing, consent and how to support a friend.</p>`;
}

function renderHow() {
  const C = CONFIG;
  const total = C.factors.reduce((s, f) => s + f.max, 0);
  $("how-body").innerHTML = `
    <p>Each route is checked every ${C.sampleStep} m. It earns points for:</p>
    <ul>${C.factors.map((f) => `<li>${esc(f.label)}: up to ${f.max}</li>`).join("")}</ul>
    <p>The points add up to ${total}, then turn into a score out of 100.</p>
    <h3>Empty stretches</h3>
    <p>A stretch of ${C.gap.minMetres} m or more with nothing open within ${C.radius.gapCover} m loses ${C.gap.basePenalty} points, plus ${C.gap.penaltyPer100m} for every extra 100 m, up to ${C.gap.maxPenalty}.</p>
    <h3>Grades</h3>
    <ul>${C.grades.map(([g, min], i) => `<li>${g}: ${min}${i === 0 ? " and above" : `–${C.grades[i - 1][1] - 1}`}</li>`).join("")}</ul>
    <p>Routes within ${C.closeCall} points of each other are flagged as a close call.</p>
    <h3>When data is missing</h3>
    <p>Many places don't list opening hours, and many streets have no lighting data. Missing data counts as half, never as full. Police stations and hospitals are assumed open at night unless their hours say otherwise.</p>
    <h3>Where the numbers come from</h3>
    <p>${esc(C.weightsNote)} Map data: OpenStreetMap contributors. Routes: OSRM.</p>`;
}

// Learn: the survey is loaded only when the tab is first opened.
// name="samman-embed" tells the Learn app to hide its own header inside SAMMAN.
function ensureLearn() {
  sizeLearn();
  if (learnLoaded) return;
  learnLoaded = true;
  const frame = $("learn-frame");
  frame.addEventListener("load", () => { $("learn-status").textContent = ""; }, { once: true });
  if (typeof LEARN_B64 !== "undefined") {
    $("learn-newtab").hidden = true; // single-file version has no separate file to open
    try {
      const bytes = Uint8Array.from(atob(LEARN_B64), (c) => c.charCodeAt(0));
      frame.src = URL.createObjectURL(new Blob([bytes], { type: "text/html" }));
    } catch (err) {
      // Browsers without Blob URLs: fall back to inline HTML.
      console.warn(err);
      frame.srcdoc = new TextDecoder().decode(Uint8Array.from(atob(LEARN_B64), (c) => c.charCodeAt(0)));
    }
  } else {
    frame.src = "learn.html";
  }
}

// On phones, Learn fills the space between the top bar and the tab bar,
// so there is one scroll area instead of a small box inside a scrolling page.
function sizeLearn() {
  if (current !== "learn") return;
  const frame = $("learn-frame");
  const top = frame.getBoundingClientRect().top + window.scrollY;
  const tabbar = document.querySelector(".tabbar").offsetHeight;
  const viewport = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  frame.style.height = `${Math.max(300, Math.floor(viewport - top - tabbar - 12))}px`;
}
window.addEventListener("resize", sizeLearn);
window.visualViewport?.addEventListener("resize", sizeLearn);

/* ---------- 10. Start-up ---------- */
const TIPS = [
  "Trust your instincts. If something feels wrong, you don't need a reason to leave.",
  "Check routes for the time you'll actually walk. A shop open at 8 pm may be shut by 11.",
  "Save 112, 181 and 1098 in your phone now, before you ever need them.",
  "Before a late walk, tell someone your route and when you expect to arrive.",
];
$("tip-text").textContent = TIPS[new Date().getDate() % TIPS.length];

$("trip-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const from = $("from").value.trim(), to = $("to").value.trim();
  if (!from || !to) return planStatus("Enter where you're starting and where you're going.");
  planTrip(from, to);
});
$("sample-btn").addEventListener("click", () =>
  presentTrip(SAMPLE, chosenTime(), "This is a made-up sample trip, so you can see how grading works. Go back to plan your own."));
$("use-location").addEventListener("click", () => {
  if (!navigator.geolocation) return planStatus("This browser can't share location.");
  planStatus("Getting your location…");
  navigator.geolocation.getCurrentPosition((pos) => {
    myLocation = { name: "My location", lat: pos.coords.latitude, lon: pos.coords.longitude };
    $("from").value = "My location";
    planStatus("Starting point set to your location.");
  }, (err) => planStatus(`${geoMessage(err)} Or type a starting place.`));
});

const now = new Date();
$("when").value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
renderDirectory();
renderHow();
show("home");

