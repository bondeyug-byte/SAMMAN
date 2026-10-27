import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Scenario, ScenarioOption } from '../content/types';
import { topicById } from '../content/topics';
import { sessionById } from '../content/programme';
import { useDemo, type ScenarioProgress } from '../state/DemoState';
import { ContentNote, KindBadge } from './ui';

type View = 'gate' | 'stage' | 'feedback' | 'end' | 'paused' | 'skipped';

interface Local {
  view: View;
  stageId: string;
  selected?: string;
  history: { stageId: string; optionId: string; attempts: number }[];
  attempts: Record<string, number>;
  revisit: string[];
}

const fresh = (s: Scenario, gate: boolean): Local => ({
  view: gate ? 'gate' : 'stage',
  stageId: s.stages[0].id,
  history: [],
  attempts: {},
  revisit: [],
});

function fromProgress(s: Scenario, p: ScenarioProgress | undefined, gate: boolean): Local {
  if (!p) return fresh(s, gate);
  const view: View = p.status === 'completed' ? 'end' : p.status === 'skipped' ? 'skipped' : p.status === 'paused' ? 'paused' : 'stage';
  return { view, stageId: p.stageId, history: p.history, attempts: {}, revisit: p.revisit };
}

export default function ScenarioPlayer({ scenario, compact = false }: { scenario: Scenario; compact?: boolean }) {
  const demo = useDemo();
  const gateOn = demo.showContentNotes && !compact;
  const [st, setSt] = useState<Local>(() => (compact ? fresh(scenario, false) : fromProgress(scenario, demo.progress[scenario.id], gateOn)));
  const focusRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Reset when the demo is reset.
  useEffect(() => {
    if (firstRender.current) return;
    setSt(fresh(scenario, gateOn));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo.resetCount]);

  // Sync to session memory (full scenario pages only).
  useEffect(() => {
    if (compact) return;
    if (firstRender.current) return;
    const status: ScenarioProgress['status'] =
      st.view === 'end' ? 'completed' : st.view === 'skipped' ? 'skipped' : st.view === 'paused' ? 'paused' : 'in-progress';
    if (st.view === 'gate') return;
    demo.setProgress(scenario.id, { stageId: st.stageId, history: st.history, revisit: st.revisit, status });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st.view, st.stageId, st.history, st.revisit]);

  // Move focus to the new heading when the view changes (not on first load).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    focusRef.current?.focus({ preventScroll: false });
  }, [st.view, st.stageId]);

  const stage = scenario.stages.find((x) => x.id === st.stageId) ?? scenario.stages[0];
  const option = stage.options.find((o) => o.id === st.selected);
  const stageIndex = st.history.length + 1;
  const reasonableOthers = useMemo(
    () => stage.options.filter((o) => o.kind === 'reasonable' && o.id !== st.selected),
    [stage, st.selected],
  );

  const choose = (o: ScenarioOption) =>
    setSt((p) => ({
      ...p,
      view: 'feedback',
      selected: o.id,
      attempts: { ...p.attempts, [p.stageId]: (p.attempts[p.stageId] ?? 0) + 1 },
      revisit: Array.from(new Set([...p.revisit, ...(o.revisit ?? [])])),
    }));

  const revise = () => setSt((p) => ({ ...p, view: 'stage', selected: undefined }));

  const proceed = () =>
    setSt((p) => {
      if (!option) return p;
      const history = [...p.history, { stageId: p.stageId, optionId: option.id, attempts: p.attempts[p.stageId] ?? 1 }];
      if (option.next) return { ...p, history, view: 'stage', stageId: option.next, selected: undefined };
      return { ...p, history, view: 'end', selected: undefined };
    });

  const restart = () => setSt(fresh(scenario, false));
  const skip = () => setSt((p) => ({ ...p, view: 'skipped', selected: undefined }));
  const pause = () => setSt((p) => ({ ...p, view: 'paused' }));
  const resume = () => setSt((p) => ({ ...p, view: p.history.length || p.stageId !== scenario.stages[0].id ? 'stage' : 'stage' }));

  const session = sessionById[scenario.sessionId];
  const fullLink = `/practice/${scenario.id}`;

  const controls = !compact && st.view !== 'end' && st.view !== 'skipped' && (
    <nav className="scenario-controls" aria-label="Scenario controls">
      {st.view !== 'paused' ? (
        <button type="button" className="btn-text" onClick={pause}>
          Pause
        </button>
      ) : null}
      <button type="button" className="btn-text" onClick={skip}>
        Skip this scenario
      </button>
      <Link className="btn-text" to="/questions-support">
        Support
      </Link>
      <Link className="btn-text" to="/learn">
        Return to programme
      </Link>
    </nav>
  );

  return (
    <div className={`player ${compact ? 'player-compact' : ''}`}>
      {controls}
      <div className="player-stage" key={`${st.view}-${st.stageId}-${st.selected ?? ''}`}>
        {st.view === 'gate' && (
          <div className="gate">
            <h2 ref={focusRef} tabIndex={-1}>
              Before you begin
            </h2>
            <ContentNote>{scenario.contentNote}</ContentNote>
            <p>
              You can pause, skip or leave at any time, with no penalty. Support information is available from every page. Your
              choices are private to this tab and are not scored.
            </p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => setSt((p) => ({ ...p, view: 'stage' }))}>
                Show the scenario
              </button>
              <button type="button" className="btn btn-quiet" onClick={skip}>
                Skip this scenario
              </button>
            </div>
          </div>
        )}

        {st.view === 'stage' && (
          <div className="stage">
            <p className="stage-count">
              Decision {stageIndex}
              <span className="muted"> · {stage.title}</span>
            </p>
            <div className="narrative">
              {stage.narrative.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
            <h2 className="question" ref={focusRef} tabIndex={-1}>
              {stage.question}
            </h2>
            <p className="sr-only">Choose one response. You can try a different response after reading the feedback.</p>
            <ul className="options" role="list">
              {stage.options.map((o, i) => (
                <li key={o.id}>
                  <button type="button" className="option" onClick={() => choose(o)}>
                    <span className="option-letter" aria-hidden="true">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{o.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {st.view === 'feedback' && option && (
          <div className="feedback">
            <p className="stage-count">
              Decision {stageIndex} · your response
            </p>
            <blockquote className="chosen">{option.label}</blockquote>
            <KindBadge kind={option.kind} />
            <h2 className="feedback-headline" ref={focusRef} tabIndex={-1}>
              {option.headline}
            </h2>
            <dl className="lens">
              <div>
                <dt>What assumption is operating?</dt>
                <dd>{option.assumption}</dd>
              </div>
              <div>
                <dt>Whose choice is being disregarded — or respected?</dt>
                <dd>{option.choice}</dd>
              </div>
              <div>
                <dt>What responsibility belongs to each person?</dt>
                <dd>{stage.responsibility}</dd>
              </div>
              <div>
                <dt>What could be done safely?</dt>
                <dd>{option.safely}</dd>
              </div>
              <div>
                <dt>What is outside your role?</dt>
                <dd>{stage.outsideRole}</dd>
              </div>
            </dl>
            {reasonableOthers.length > 0 && (
              <div className="others">
                <p className="others-h">{option.kind === 'reasonable' ? 'Other reasonable responses here' : 'Reasonable responses here include'}</p>
                <ul>
                  {reasonableOthers.map((o) => (
                    <li key={o.id}>{o.label}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="illustration-note">Branches are illustrations for discussion. They do not predict how real people behave.</p>
            <div className="btn-row">
              <button type="button" className={option.kind === 'reasonable' ? 'btn btn-quiet' : 'btn'} onClick={revise}>
                Try a different response
              </button>
              <button type="button" className={option.kind === 'reasonable' ? 'btn' : 'btn btn-quiet'} onClick={proceed}>
                {option.next ? 'Continue to the next decision' : 'Continue to reflection'}
              </button>
            </div>
          </div>
        )}

        {st.view === 'end' && (
          <End
            scenario={scenario}
            st={st}
            compact={compact}
            focusRef={focusRef}
            restart={restart}
            sessionTitle={session?.title}
            fullLink={fullLink}
          />
        )}

        {st.view === 'paused' && (
          <div className="state-panel">
            <h2 ref={focusRef} tabIndex={-1}>
              Paused
            </h2>
            <p>Your place is kept in this tab until you refresh or reset the demo.</p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={resume}>
                Resume
              </button>
              <Link className="btn btn-quiet" to="/practice">
                Back to all scenarios
              </Link>
            </div>
          </div>
        )}

        {st.view === 'skipped' && (
          <div className="state-panel">
            <h2 ref={focusRef} tabIndex={-1}>
              Scenario skipped
            </h2>
            <p>There is no penalty for skipping. Support information remains available from every page.</p>
            <div className="btn-row">
              <Link className="btn" to="/practice">
                Choose another scenario
              </Link>
              <Link className="btn btn-quiet" to="/questions-support">
                Support information
              </Link>
              <button type="button" className="btn-text" onClick={restart}>
                Start this scenario after all
              </button>
            </div>
          </div>
        )}
      </div>

      {compact && st.view !== 'end' && (
        <p className="compact-foot">
          <Link to={fullLink}>Explore the full scenario</Link>
          {st.view === 'feedback' && (
            <>
              {' · '}
              <button type="button" className="btn-text" onClick={revise}>
                Try a different response
              </button>
            </>
          )}
        </p>
      )}
    </div>
  );
}

function End({
  scenario,
  st,
  compact,
  focusRef,
  restart,
  sessionTitle,
  fullLink,
}: {
  scenario: Scenario;
  st: Local;
  compact: boolean;
  focusRef: React.RefObject<HTMLHeadingElement>;
  restart: () => void;
  sessionTitle?: string;
  fullLink: string;
}) {
  const { reflections, setReflection } = useDemo();
  const key = `scenario:${scenario.id}`;
  const [draft, setDraft] = useState(reflections[key] ?? '');
  return (
    <div className="end">
      <h2 ref={focusRef} tabIndex={-1}>
        Scenario complete
      </h2>
      <p className="closing">{scenario.closing}</p>

      <h3>Your path</h3>
      <ol className="path">
        {st.history.map((h) => {
          const stage = scenario.stages.find((s) => s.id === h.stageId)!;
          const opt = stage.options.find((o) => o.id === h.optionId)!;
          return (
            <li key={h.stageId}>
              <span className="path-stage">{stage.title}</span>
              <span>{opt.label}</span>
              <KindBadge kind={opt.kind} />
              {h.attempts > 1 && <span className="muted"> · tried {h.attempts} responses</span>}
            </li>
          );
        })}
      </ol>

      <h3>Topics to revisit</h3>
      {st.revisit.length ? (
        <ul className="revisit">
          {st.revisit.map((id) => (
            <li key={id}>
              <Link to="/learn" state={{ topic: id }}>
                {topicById[id]?.letter}. {topicById[id]?.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No specific topics suggested from the responses you explored. You can still browse all topics.</p>
      )}
      <p className="small">This is not a score and says nothing about you as a person.</p>

      {!compact && (
        <>
          <h3>Optional reflection</h3>
          <label htmlFor={`refl-${scenario.id}`} className="refl-q">
            {scenario.reflection}
          </label>
          <p className="field-warning">Kept in this tab only. Please don’t include names or personal incident details.</p>
          <textarea
            id={`refl-${scenario.id}`}
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => setReflection(key, draft)}
          />

          <h3>For facilitated discussion</h3>
          <p>{scenario.facilitatorPrompt}</p>
        </>
      )}

      <div className="btn-row">
        <button type="button" className="btn btn-quiet" onClick={restart}>
          Revisit from the start
        </button>
        {compact ? (
          <Link className="btn" to={fullLink}>
            Explore the full scenario
          </Link>
        ) : (
          <>
            <Link className="btn" to="/practice">
              Choose another scenario
            </Link>
            <Link className="btn-text" to="/learn">
              Return to programme{sessionTitle ? ` (${sessionTitle})` : ''}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
