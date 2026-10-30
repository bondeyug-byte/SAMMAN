import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { SAMPLE } from './sample';
import { gradeTrip, type LatLon, type Prepared, type Scored, type Trip } from './scoring';
import { boundsOf, fetchPlaces, fetchRoutes, geocode, geoMessage } from './services';

// Safe travel state, held in memory only (cleared by refresh or Reset demo).
export interface TripResult {
  trip: Trip;
  when: Date;
  graded: boolean;
  data: Prepared | null;
  scored: Scored[];
  isSample: boolean;
  notice: string;
  selectedId: number | null;
}

const BACKUP_NOTE = 'Graded using a backup server for nearby places. Its map data may be a few months old.';
const nowHHMM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

interface GuideApi {
  from: string; to: string; when: string;
  setFrom: (v: string) => void; setTo: (v: string) => void; setWhen: (v: string) => void;
  status: string; busy: boolean; retrying: boolean;
  result: TripResult | null;
  useMyLocation: () => void;
  plan: () => Promise<boolean>;
  useSample: () => void;
  retryGrading: () => Promise<boolean>;
  pick: (id: number) => void;
}

const Ctx = createContext<GuideApi | null>(null);

export function GuideProvider({ children }: { children: ReactNode }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [when, setWhen] = useState(nowHHMM);
  const [myLocation, setMyLocation] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [result, setResult] = useState<TripResult | null>(null);

  const chosenTime = useCallback(() => {
    const [h, m] = (when || '00:00').split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  }, [when]);

  // She picks a route; nothing is pre-selected. When re-grading, the route she had open stays chosen.
  const present = useCallback((trip: Trip, at: Date, notice: string, isSample: boolean, keep?: LatLon[]) => {
    const { graded, data, scored } = gradeTrip(trip, at);
    const selectedId = keep ? scored.find((r) => r.coords === keep)?.id ?? null : null;
    setResult({ trip, when: at, graded, data, scored, isSample, notice, selectedId });
  }, []);

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) return setStatus(`${geoMessage(null)} Or type a starting place.`);
    setStatus('Getting your location…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLocation({ name: 'My location', lat: pos.coords.latitude, lon: pos.coords.longitude });
        setFrom('My location');
        setStatus('Starting point set to your location.');
      },
      (err) => setStatus(`${geoMessage(err)} Or type a starting place.`),
    );
  }, []);

  const plan = useCallback(async () => {
    const f = from.trim(), t = to.trim();
    if (!f || !t) { setStatus("Enter where you're starting and where you're going."); return false; }
    const at = chosenTime();
    setBusy(true);
    try {
      let a, b, routes;
      try {
        setStatus('Finding the two places…');
        a = f === 'My location' && myLocation ? myLocation : await geocode(f);
        b = await geocode(t);
        if (!a || !b) { setStatus(`Couldn't find "${!a ? f : t}". Try adding the area, like "Naupada, Thane".`); return false; }
        setStatus('Finding walking routes…');
        routes = await fetchRoutes(a, b);
      } catch (err) {
        console.warn(err);
        setStatus(`Couldn't reach the map services (${(err as Error).message}). Check your connection and try again, or try a sample trip.`);
        return false;
      }
      setStatus('Checking what’s along each route…');
      let elements = null, notice = '';
      try {
        const res = await fetchPlaces(boundsOf(routes.flatMap((r) => r.coords)), () => setStatus('That server is busy, trying another…'));
        elements = res.elements;
        if (res.backup) notice = BACKUP_NOTE;
      } catch (err) {
        notice = `We found walking routes, but couldn't load nearby places to grade them (${(err as Error).message}). Routes are shown without grades.`;
      }
      setStatus('');
      present({ from: a, to: b, routes, elements }, at, notice, false);
      return true;
    } finally {
      setBusy(false);
    }
  }, [from, to, myLocation, chosenTime, present]);

  const useSample = useCallback(() => {
    setStatus('');
    present(SAMPLE, chosenTime(), 'This is a made-up sample trip, so you can see how grading works. Go back to plan your own.', true);
  }, [present, chosenTime]);

  const retryGrading = useCallback(async () => {
    if (!result || result.graded || result.isSample) return false;
    setRetrying(true);
    try {
      const res = await fetchPlaces(boundsOf(result.trip.routes.flatMap((r) => r.coords)));
      const keep = result.scored.find((r) => r.id === result.selectedId)?.coords;
      present({ ...result.trip, elements: res.elements }, result.when, res.backup ? BACKUP_NOTE : '', false, keep);
      return true;
    } catch (err) {
      console.warn(err);
      setResult({ ...result, notice: `Still couldn't load nearby places (${(err as Error).message}). The free public map servers are busy. Please try again in a minute.` });
      return false;
    } finally {
      setRetrying(false);
    }
  }, [result, present]);

  const pick = useCallback((id: number) => setResult((r) => (r ? { ...r, selectedId: id } : r)), []);

  const api = useMemo<GuideApi>(
    () => ({ from, to, when, setFrom, setTo, setWhen, status, busy, retrying, result, useMyLocation, plan, useSample, retryGrading, pick }),
    [from, to, when, status, busy, retrying, result, useMyLocation, plan, useSample, retryGrading, pick],
  );
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useGuide() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useGuide must be used inside GuideProvider');
  return v;
}
