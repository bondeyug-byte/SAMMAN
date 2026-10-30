import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CONFIG } from './config';
import type { TripResult } from './GuideState';
import { km } from './services';

// One Leaflet map. Compare shows every route; Details shows the chosen one with its
// empty stretches and help points. If the map or street pictures can't load, routes
// and grades still work and a note says so.
const INK = { chosen: '#123e47', other: '#7c8a8c', gap: '#8b2e3b', help: '#0f3039' };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const OSM_CREDIT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const TILE_SOURCES = [
  ...(CONFIG.cartoKey
    ? [{ url: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${CONFIG.cartoKey}`, options: { subdomains: 'abcd', attribution: `${OSM_CREDIT} &copy; <a href="https://carto.com/attributions">CARTO</a>` } }]
    : []),
  { url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', options: { attribution: OSM_CREDIT } },
];
const HELP_NAME: Record<string, string> = { police: 'Police', hospital: 'Hospital', clinic: 'Clinic', pharmacy: 'Chemist', fuel: 'Petrol pump' };

export default function RouteMap({
  result,
  mode,
  showCameras = false,
  onPick,
}: {
  result: TripResult;
  mode: 'compare' | 'details';
  showCameras?: boolean;
  onPick?: (id: number) => void;
}) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layers = useRef<{ routes: L.LayerGroup; detail: L.LayerGroup; cameras: L.LayerGroup } | null>(null);
  const lines = useRef<Map<number, L.Polyline>>(new Map());
  const userMoved = useRef(false);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;
  const [note, setNote] = useState('');

  const fit = () => {
    const map = mapRef.current;
    if (!map || userMoved.current) return;
    const sel = result.scored.find((r) => r.id === result.selectedId);
    const routes = mode === 'details' && sel ? [sel] : result.scored;
    map.fitBounds(L.latLngBounds(routes.flatMap((r) => r.coords)), { padding: [28, 28], animate: false });
  };

  // Create the map once.
  useEffect(() => {
    if (!el.current) return;
    let map: L.Map;
    try {
      map = L.map(el.current, { zoomControl: false }).setView([19.2, 72.97], 13);
    } catch (err) {
      console.warn('Map unavailable:', err);
      setNote("The map couldn't start in this browser, so routes are listed without a map. Grades still work.");
      return;
    }
    map.attributionControl.setPosition('bottomleft');
    mapRef.current = map;
    layers.current = { routes: L.layerGroup().addTo(map), detail: L.layerGroup().addTo(map), cameras: L.layerGroup() };
    map.on('dragstart', () => { userMoved.current = true; });

    // Street pictures: CARTO first, then OpenStreetMap. If neither loads, say so plainly.
    let tiles: L.TileLayer | null = null, index = 0, loaded = 0, failed = 0, watch = 0;
    const use = (i: number) => {
      if (tiles) map.removeLayer(tiles);
      index = i; loaded = 0; failed = 0;
      const layer = L.tileLayer(TILE_SOURCES[i].url, { maxZoom: 19, ...TILE_SOURCES[i].options });
      layer.on('tileload', () => { if (layer === tiles) { loaded++; setNote(''); } });
      layer.on('tileerror', () => { if (layer === tiles && ++failed >= 4 && loaded === 0) next(); });
      tiles = layer.addTo(map);
      layer.bringToBack();
      clearTimeout(watch);
      // Some networks hang instead of refusing, so also give up after 8 seconds.
      watch = window.setTimeout(() => { if (layer === tiles && loaded === 0) next(); }, 8000);
    };
    const next = () => {
      if (index + 1 < TILE_SOURCES.length) use(index + 1);
      else setNote("The street map couldn't load here, so only the routes are shown. Grades still work. Open SAMMAN from its website in Chrome, or try mobile data.");
    };
    use(0);

    const ro = window.ResizeObserver ? new ResizeObserver(() => { if (mapRef.current !== map) return; map.invalidateSize({ animate: false }); fit(); }) : null;
    ro?.observe(el.current);
    return () => {
      clearTimeout(watch);
      ro?.disconnect();
      mapRef.current = null;
      map.stop(); // cancel any pan/zoom in progress so removal can't hit a half-finished animation
      map.off();
      map.remove();
      mapRef.current = null;
      layers.current = null;
      lines.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw pins and route lines whenever the trip changes.
  useEffect(() => {
    const map = mapRef.current, lg = layers.current;
    if (!map || !lg) return;
    lg.routes.clearLayers(); lg.cameras.clearLayers(); lines.current.clear();
    const { trip, scored } = result;
    const pin = (cls: string) => L.divIcon({ className: '', html: `<span class="pin ${cls}"></span>`, iconSize: [26, 26], iconAnchor: [13, 13] });
    L.marker([trip.from.lat, trip.from.lon], { icon: pin('') }).bindTooltip(`Start: ${esc(trip.from.name)}`).addTo(lg.routes);
    L.marker([trip.to.lat, trip.to.lon], { icon: pin('pin-end') }).bindTooltip(`End: ${esc(trip.to.name)}`).addTo(lg.routes);
    for (const r of scored) {
      const line = L.polyline(r.coords, { color: INK.other, weight: 5, opacity: 0.75 })
        .bindTooltip(result.graded ? `Route ${r.letter}, grade ${r.grade}` : `Route ${r.letter}, not graded`)
        .on('click', () => pickRef.current?.(r.id))
        .addTo(lg.routes);
      lines.current.set(r.id, line);
    }
    for (const c of result.data?.cameras ?? []) {
      L.circleMarker(c.pt, { radius: 4, color: '#3a4a4d', weight: 1, fillColor: '#3a4a4d', fillOpacity: 0.8 })
        .bindTooltip('CCTV camera, as mapped by OpenStreetMap volunteers').addTo(lg.cameras);
    }
    userMoved.current = false;
    map.invalidateSize({ animate: false });
    fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.trip, result.scored]);

  // Highlight the chosen route; in Details, show only it plus its gaps and help points.
  useEffect(() => {
    const lg = layers.current;
    if (!lg) return;
    lg.detail.clearLayers();
    for (const r of result.scored) {
      const line = lines.current.get(r.id);
      if (!line) continue;
      const chosen = r.id === result.selectedId;
      if (mode === 'details' && !chosen) { line.setStyle({ opacity: 0 }); continue; }
      line.setStyle({ color: chosen ? INK.chosen : INK.other, weight: chosen ? 7 : 5, opacity: chosen ? 1 : 0.75 });
      if (chosen) line.bringToFront();
    }
    const sel = result.scored.find((r) => r.id === result.selectedId);
    if (mode === 'details' && sel) {
      for (const g of sel.gaps) {
        L.polyline(g.pts, { color: INK.gap, weight: 12, opacity: 0.45, dashArray: '2 10', lineCap: 'round' })
          .bindTooltip(`Empty stretch, ${km(g.len)}: nothing open nearby`).addTo(lg.detail);
      }
      for (const h of sel.helpNear) {
        const hours = h.state === true ? 'open then' : h.state === false ? 'closed then'
          : (CONFIG.alwaysOpen as readonly string[]).includes(h.tags.amenity) ? 'usually open all night (assumed)' : 'hours not listed';
        L.circleMarker(h.pt, { radius: 7, color: '#fff', weight: 2, fillColor: INK.help, fillOpacity: 1 })
          .bindTooltip(`${esc(h.tags.name || HELP_NAME[h.tags.amenity] || 'Help point')}, ${hours}`).addTo(lg.detail);
      }
    }
    if (mode === 'details') fit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.selectedId, result.scored, mode]);

  // CCTV layer toggle (cameras don't change the grade).
  useEffect(() => {
    const map = mapRef.current, lg = layers.current;
    if (!map || !lg) return;
    if (showCameras) lg.cameras.addTo(map);
    else lg.cameras.remove();
  }, [showCameras]);

  return (
    <div className="map-box">
      <div ref={el} className="route-map" role="img" aria-label={mode === 'details' ? 'Map of the chosen route' : 'Map of route options'} hidden={!!note && !mapRef.current} />
      {note && (
        <p className="map-note" role="status">
          {note}
        </p>
      )}
    </div>
  );
}
