import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CONFIG } from '../guide/config';
import { useGuide } from '../guide/GuideState';
import RouteMap from '../guide/RouteMap';
import { km, minutes, todaysTip } from '../guide/services';
import { IconArrowRight, IconClock, IconDirection, IconLocate, IconPhone, IconPin } from '../components/Icons';
import { PageHeader } from '../components/ui';

// Safe travel: compare walking routes before you leave (ported from SAMMAN 4.0's Guide).
// /guide → plan, /guide/routes → compare, /guide/route → details, /guide/how → how grades work.

const WAYS = ['', 'One way', 'Two ways', 'Three ways', 'Four ways', 'Five ways'];
const whenLabel = (d: Date) => `Today, ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;

function EmergencyLink() {
  return (
    <Link to="/emergency" className="em-link">
      <IconPhone size={22} /> Emergency contacts
    </Link>
  );
}

function Banner({ text }: { text: string }) {
  return text ? (
    <p className="banner" role="status">
      {text}
    </p>
  ) : null;
}

function Grade({ grade, graded }: { grade: string | null; graded: boolean }) {
  return graded && grade ? (
    <span className={`grade grade-${grade}`} aria-label={`Grade ${grade}`}>
      {grade}
    </span>
  ) : (
    <span className="grade grade-none" aria-label="Not graded">
      –
    </span>
  );
}

function RetryButton({ className = 'btn-text' }: { className?: string }) {
  const g = useGuide();
  const [toast, setToast] = useState('');
  return (
    <>
      <button
        type="button"
        className={className}
        data-retry
        disabled={g.retrying}
        onClick={async () => setToast((await g.retryGrading()) ? 'Routes graded.' : 'Still couldn’t grade. Try again in a minute.')}
      >
        {g.retrying ? 'Grading…' : 'Try grading again'}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {toast}
      </span>
    </>
  );
}

/* ── Plan ───────────────────────────────────── */
export function GuidePlan() {
  const g = useGuide();
  const nav = useNavigate();
  const loc = useLocation();
  const whenRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if ((loc.state as { focus?: string } | null)?.focus === 'when') {
      whenRef.current?.scrollIntoView({ block: 'center' });
      whenRef.current?.focus();
    }
  }, [loc.state]);

  return (
    <div className="page">
      <PageHeader eyebrow="Safe travel" title="Where are you headed?">
        <p>Compare walking routes before you leave. Each route is graded on what’s around it at the time you’ll walk.</p>
      </PageHeader>
      <section className="wrap section guide">
        <form
          className="trip-form"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (await g.plan()) nav('/guide/routes');
          }}
        >
          <div className="field">
            <label htmlFor="from">From</label>
            <div className="field-row">
              <input id="from" autoComplete="off" placeholder="Current location" value={g.from} onChange={(e) => g.setFrom(e.target.value)} />
              <button type="button" id="use-location" className="field-btn" aria-label="Use my current location" onClick={g.useMyLocation}>
                <IconLocate />
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="to">To</label>
            <div className="field-row">
              <input id="to" autoComplete="off" placeholder="Choose destination" value={g.to} onChange={(e) => g.setTo(e.target.value)} />
              <span className="field-ic" aria-hidden="true">
                <IconPin size={20} />
              </span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="when">Leaving</label>
            <div className="field-row">
              <input id="when" ref={whenRef} type="time" value={g.when} onChange={(e) => g.setWhen(e.target.value)} />
              <span className="field-ic" aria-hidden="true">
                <IconClock />
              </span>
            </div>
          </div>
          <div className="btn-row">
            <button type="submit" id="find-btn" className="btn" disabled={g.busy}>
              {g.busy ? 'Finding routes…' : 'Compare routes'}
            </button>
            <button
              type="button"
              id="sample-btn"
              className="btn-text"
              onClick={() => {
                g.useSample();
                nav('/guide/routes');
              }}
            >
              Or try a sample trip
            </button>
          </div>
          <p id="plan-status" className="status" role="status" aria-live="polite">
            {g.status}
          </p>
        </form>
        <p className="tip">
          <strong>Tip.</strong> {todaysTip()}
        </p>
        <EmergencyLink />
      </section>
    </div>
  );
}

/* ── Compare ────────────────────────────────── */
export function GuideRoutes() {
  const g = useGuide();
  const nav = useNavigate();
  const r = g.result;
  if (!r) return <Navigate to="/guide" replace />;
  const { scored, graded, isSample, trip } = r;
  const close = graded && scored.length > 1 && (scored[0].score ?? 0) - (scored[1].score ?? 0) <= CONFIG.closeCall;
  const sel = scored.find((x) => x.id === r.selectedId);

  return (
    <div className="page">
      <div className="wrap guide-top">
        <Link to="/guide" className="back">
          ← Change trip
        </Link>
      </div>
      <PageHeader eyebrow="Safe travel" title={`${WAYS[scored.length] || `${scored.length} ways`} to get there`}>
        <p id="compare-when">
          {whenLabel(r.when)}. {isSample ? 'Sample trip.' : `${trip.from.name} to ${trip.to.name}.`}
        </p>
      </PageHeader>
      <section className="wrap section guide">
        <Banner text={r.notice} />
        <div className="guide-grid">
          <div className="guide-map">
            <RouteMap result={r} mode="compare" onPick={g.pick} />
          </div>
          <div className="guide-list">
            {close && (
              <p className="close-call">
                Close call: routes {scored[0].letter} and {scored[1].letter} score {scored[0].score} and {scored[1].score}. Check the details of both.
              </p>
            )}
            <fieldset className="route-options">
              <legend className="sr-only">Choose a route</legend>
              {scored.map((x) => (
                <label key={x.id} className={`route-opt ${r.selectedId === x.id ? 'is-on' : ''}`}>
                  <input type="radio" name="route" value={x.id} checked={r.selectedId === x.id} onChange={() => g.pick(x.id)} />
                  <Grade grade={x.grade} graded={graded} />
                  <span className="ro-main">
                    <span>
                      <strong>Route {x.letter}</strong>
                      {x.isSafest && <span className="tag tag-safe">Safest</span>}
                      {x.isFastest && <span className="tag tag-fast">Fastest</span>}
                    </span>
                    <span className="meta">
                      {minutes(x.duration)} · {km(x.lengthM)} · {graded ? `score ${x.score}` : 'not graded'}
                    </span>
                    {x.gaps.length > 0 && (
                      <span className="warn">
                        {x.gaps.length === 1 ? '1 empty stretch' : `${x.gaps.length} empty stretches`}, longest {km(Math.max(...x.gaps.map((gp) => gp.len)))}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </fieldset>
            {isSample && <p className="small muted"><em>Illustrative routes (sample data)</em></p>}
            {!graded && !isSample && <RetryButton />}
            <div className="btn-row">
              <button type="button" id="details-btn" className="btn" disabled={!sel} onClick={() => nav('/guide/route')}>
                {sel ? `See route ${sel.letter} details` : 'Pick a route to see details'}
              </button>
              <Link to="/guide/how" className="btn-text">
                How grades are worked out
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Details ────────────────────────────────── */
export function GuideRoute() {
  const g = useGuide();
  const [cams, setCams] = useState(false);
  const r = g.result;
  if (!r) return <Navigate to="/guide" replace />;
  const x = r.scored.find((s) => s.id === r.selectedId);
  if (!x) return <Navigate to="/guide/routes" replace />;
  const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
  const steps = x.steps || [];

  return (
    <div className="page">
      <div className="wrap guide-top">
        <Link to="/guide/routes" className="back">
          ← All routes
        </Link>
      </div>
      <PageHeader eyebrow="Safe travel" title={`Route ${x.letter}: your walking route`}>
        <p id="details-sub">
          {minutes(x.duration)} · {km(x.lengthM)} · {r.graded ? `grade ${x.grade}, score ${x.score} of 100` : 'not graded'}
        </p>
      </PageHeader>
      <section className="wrap section guide">
        <div className="guide-grid">
          <div className="guide-map">
            <RouteMap result={r} mode="details" showCameras={cams} />
            <label className="check-row cam-toggle">
              <input type="checkbox" id="cam-toggle" checked={cams} onChange={(e) => setCams(e.target.checked)} />
              <span>
                Show CCTV cameras <span className="muted small">(mapping is incomplete; cameras don’t change the grade)</span>
              </span>
            </label>
          </div>
          <div className="guide-list">
            <section id="why" aria-labelledby="why-h">
              {r.graded ? (
                <>
                  <h2 id="why-h">Why grade {x.grade}</h2>
                  <ul className="factors">
                    {x.factors.map((f) => (
                      <li key={f.id}>
                        <div className="factor-top">
                          <span>{f.label}</span>
                          <span>
                            {f.points} of {f.max}
                          </span>
                        </div>
                        <div className="bar-track" aria-hidden="true">
                          <span className="bar-fill" style={{ width: `${(f.points / f.max) * 100}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="small muted">
                    {x.gaps.length ? `Empty stretches take off ${x.penalty} points. ` : ''}
                    {x.openCount} of {x.placeCount} places along the way are open then; {x.unknownCount} {plural(x.unknownCount, "doesn't", "don't")} list{' '}
                    {plural(x.unknownCount, 'its', 'their')} hours. Lighting is mapped for {x.lightKnownPct}% of this route.
                  </p>
                </>
              ) : (
                <>
                  <h2 id="why-h">Not graded</h2>
                  <p>We couldn’t load the nearby places needed to grade this route, so there’s no grade to show. The route and directions below are real.</p>
                  <RetryButton className="btn btn-quiet" />
                </>
              )}
            </section>
            <h2>Walking directions</h2>
            <ol className="directions" id="directions">
              {steps.length ? (
                steps.map((s, i) => (
                  <li key={i}>
                    <IconDirection dir={s.dir} />
                    <span>{s.text}</span>
                    <small>{s.dist}</small>
                  </li>
                ))
              ) : (
                <li>
                  <span>Directions aren’t available for this route.</span>
                </li>
              )}
            </ol>
            {r.isSample && <p className="small muted"><em>Illustrative directions (sample data)</em></p>}
            <div className="btn-row">
              <Link to="/guide" state={{ focus: 'when' }} className="btn btn-quiet" id="change-time">
                Change departure time
              </Link>
            </div>
            <EmergencyLink />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── How grades are worked out ──────────────── */
export function GuideHow() {
  const C = CONFIG;
  const total = C.factors.reduce((s, f) => s + f.max, 0);
  const g = useGuide();
  return (
    <div className="page">
      <div className="wrap guide-top">
        <Link to={g.result ? '/guide/routes' : '/guide'} className="back">
          ← {g.result ? 'Back to routes' : 'Back to Safe travel'}
        </Link>
      </div>
      <PageHeader eyebrow="Safe travel" title="How grades are worked out">
        <p>Each route is checked every {C.sampleStep} m along the way.</p>
      </PageHeader>
      <section className="wrap section prose how" id="how-body">
        <h2>What earns points</h2>
        <ul>
          {C.factors.map((f) => (
            <li key={f.id}>
              {f.label}: up to {f.max}
            </li>
          ))}
        </ul>
        <p>The points add up to {total}, then turn into a score out of 100.</p>
        <h2>Empty stretches</h2>
        <p>
          A stretch of {C.gap.minMetres} m or more with nothing open within {C.radius.gapCover} m loses {C.gap.basePenalty} points, plus{' '}
          {C.gap.penaltyPer100m} for every extra 100 m, up to {C.gap.maxPenalty}.
        </p>
        <h2>Grades</h2>
        <ul>
          {C.grades.map(([gr, min], i) => (
            <li key={gr}>
              {gr}: {min}
              {i === 0 ? ' and above' : `–${C.grades[i - 1][1] - 1}`}
            </li>
          ))}
        </ul>
        <p>Routes within {C.closeCall} points of each other are flagged as a close call.</p>
        <h2>When data is missing</h2>
        <p>
          Many places don’t list opening hours, and many streets have no lighting data. Missing data counts as half, never as full. Police
          stations and hospitals are assumed open at night unless their hours say otherwise. If nearby places can’t be loaded at all, routes
          are shown without grades rather than with invented ones.
        </p>
        <h2>Where the numbers come from</h2>
        <p>{C.weightsNote} Map data: OpenStreetMap contributors. Routes: OSRM.</p>
        <p className="small muted">A grade describes what is mapped along a route. It is not a guarantee of safety.</p>
      </section>
    </div>
  );
}

/* ── Home section: safer journeys ───────────── */
export function SaferJourneys() {
  return (
    <section className="safer" aria-labelledby="safer-h">
      <p className="label-rule">
        <span>Safer journeys</span>
      </p>
      <h2 id="safer-h" className="sr-only">
        Safer journeys
      </h2>
      <div className="safer-grid">
        <Link to="/guide" className="safer-row">
          <IconPin size={30} />
          <span>
            <strong>Safe travel</strong>
            <small>Compare walking routes before you leave</small>
          </span>
          <IconArrowRight />
        </Link>
        <Link to="/emergency" className="safer-row">
          <IconPhone size={30} />
          <span>
            <strong>Emergency and helplines</strong>
            <small>112, 181, 1098 and support centres</small>
          </span>
          <IconArrowRight />
        </Link>
        <p className="tip">
          <strong>Tip.</strong> {todaysTip()}
        </p>
      </div>
    </section>
  );
}
