// Live data for Safe travel (free, from OpenStreetMap), plus location-sharing helpers.
// Ported from SAMMAN 4.0 app.js.
import { CONFIG } from './config';
import type { LatLon, OsmElement, Place, RouteInput, Step } from './scoring';

export const minutes = (s: number) => `${Math.round(s / 60)} min`;
export const km = (m: number) => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`);

async function getJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CONFIG.timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    if (!res.ok) throw new Error(`${new URL(url).host} replied ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    const e = err as Error;
    throw new Error(e.name === 'AbortError' ? `${new URL(url).host} took too long` : e.message);
  } finally {
    clearTimeout(timer);
  }
}

export async function geocode(text: string): Promise<Place | null> {
  const params = new URLSearchParams({ q: text, format: 'jsonv2', limit: '1', countrycodes: 'in', viewbox: '72.75,19.35,73.15,18.85' });
  const [hit] = await getJSON<{ display_name: string; lat: string; lon: string }[]>(`https://nominatim.openstreetmap.org/search?${params}`);
  if (!hit) return null;
  return { name: hit.display_name.split(',').slice(0, 2).join(','), lat: +hit.lat, lon: +hit.lon };
}

interface RawStep { maneuver: { type: string; modifier?: string }; name?: string; distance: number }

// Turn the router's raw steps into short, readable directions.
function buildSteps(raw: RawStep[]): Step[] {
  const out: { dir: string; text: string; metres: number }[] = [];
  for (const s of raw) {
    const m = s.maneuver, name = s.name || 'the path', mod = m.modifier || '';
    let dir = 'up', text: string;
    if (m.type === 'depart') text = `Start on ${name}`;
    else if (m.type === 'arrive') { dir = 'flag'; text = 'Arrive at your destination'; }
    else if (mod.includes('left') || mod.includes('right')) {
      dir = mod.includes('left') ? 'left' : 'right';
      text = `${mod.startsWith('slight') ? 'Bear' : 'Turn'} ${dir} onto ${name}`;
    } else text = `Continue on ${name}`;
    const prev = out[out.length - 1];
    if (prev && dir === 'up' && prev.text.endsWith(name)) { prev.metres += s.distance; continue; }
    out.push({ dir, text, metres: s.distance });
  }
  return out.map((s) => ({ dir: s.dir, text: s.text, dist: s.dir === 'flag' ? '' : km(s.metres) }));
}

export async function fetchRoutes(a: Place, b: Place): Promise<RouteInput[]> {
  const url = `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=full&geometries=geojson&alternatives=3&steps=true`;
  const data = await getJSON<{ code: string; routes?: { duration: number; geometry: { coordinates: [number, number][] }; legs: { steps: RawStep[] }[] }[] }>(url);
  if (data.code !== 'Ok' || !data.routes?.length) throw new Error('no walking route was found');
  return data.routes.map((r) => ({
    duration: r.duration,
    coords: r.geometry.coordinates.map(([lon, lat]) => [lat, lon] as LatLon),
    steps: buildSteps(r.legs.flatMap((l) => l.steps)),
  }));
}

// Bounding box of [lat, lon] points.
export function boundsOf(pts: LatLon[]) {
  const lats = pts.map((p) => p[0]), lons = pts.map((p) => p[1]);
  return { s: Math.min(...lats), n: Math.max(...lats), w: Math.min(...lons), e: Math.max(...lons) };
}

/** Nearby places from Overpass, trying each public server in turn. */
export async function fetchPlaces(bounds: ReturnType<typeof boundsOf>, onRetry?: () => void): Promise<{ elements: OsmElement[]; backup: boolean }> {
  const padLat = (bounds.n - bounds.s) * 0.15, padLon = (bounds.e - bounds.w) * 0.15;
  const box = [bounds.s - padLat, bounds.w - padLon, bounds.n + padLat, bounds.e + padLon].map((x) => x.toFixed(5)).join(',');
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
  const errors: string[] = [];
  for (let i = 0; i < CONFIG.overpassServers.length; i++) {
    if (i > 0) onRetry?.();
    try {
      const data = await getJSON<{ elements: OsmElement[] }>(CONFIG.overpassServers[i], { method: 'POST', body: new URLSearchParams({ data: query }) });
      return { elements: data.elements, backup: i > 0 };
    } catch (err) {
      console.warn(err);
      errors.push((err as Error).message);
    }
  }
  throw new Error(errors.join('; '));
}

/* ── Location and sharing ── */

// Why did location fail? Say the real reason, and never leave her without a next step.
export function geoMessage(err: GeolocationPositionError | null) {
  const onWeb = location.protocol === 'https:' || location.hostname === 'localhost';
  const hint = onWeb ? '' : " This page isn't a secure website (for example, it was opened from WhatsApp or a downloaded file). Open SAMMAN from its website instead.";
  if (!navigator.geolocation) return "This browser can't share location." + hint;
  if (err?.code === 1) return "Location is blocked for this page. Allow location in your browser's site settings and try again." + hint;
  if (err?.code === 2) return "Your phone couldn't work out where you are. Check that Location is switched on, or step outside, then try again." + hint;
  if (err?.code === 3) return 'Finding your location took too long. Try again.' + hint;
  return "Couldn't get your location." + hint;
}

export async function shareText(text: string, say: (m: string) => void, done: string) {
  try {
    if (navigator.share) { await navigator.share({ text }); say(done); }
    else { await navigator.clipboard.writeText(text); say('Copied. Paste it into a message to someone you trust.'); }
  } catch {
    say('Sharing was cancelled, so nothing was sent.');
  }
}

export const PLAIN_HELP = "I need help. I couldn't share my location. Please call me.";

/** Shares a map link to her location; on failure explains why and asks the caller to offer the plain message. */
export function shareLocation(say: (m: string) => void, onFail: () => void) {
  const fail = (msg: string) => { say(`${msg} You can still call 112 or 181.`); onFail(); };
  if (!navigator.geolocation) return fail(geoMessage(null));
  say('Getting your location…');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude.toFixed(5), lon = pos.coords.longitude.toFixed(5);
      shareText(`I need help. My location: https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`, say, 'Location shared.');
    },
    (err) => fail(geoMessage(err)),
    { enableHighAccuracy: true, timeout: 10000 },
  );
}

export const TIPS = [
  "Trust your instincts. If something feels wrong, you don't need a reason to leave.",
  "Check routes for the time you'll actually walk. A shop open at 8 pm may be shut by 11.",
  'Save 112, 181 and 1098 in your phone now, before you ever need them.',
  'Before a late walk, tell someone your route and when you expect to arrive.',
];
export const todaysTip = () => TIPS[new Date().getDate() % TIPS.length];
