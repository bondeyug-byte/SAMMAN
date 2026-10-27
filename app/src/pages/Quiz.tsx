import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizGroups, type QuizGroup, type QuizQuestion } from '../content/quiz';
import { lessons, rechecks, type Lesson } from '../content/lessons';
import { topicById } from '../content/topics';
import { scenarioById } from '../content/scenarios';
import { Eyebrow, PageHeader } from '../components/ui';

// Flow: age → (role, if 23+) → short intro → questions.
// A missed answer opens a short lesson; missed topics are checked again with a new
// question; the end screen is a learning plan, not a score.
// Age is used only to choose questions. It stays in this component's memory.

type Step = 'age' | 'under18' | 'role' | 'pick' | 'intro' | 'quiz' | 'recheck-intro' | 'plan';
type Result = { qid: string; topicId: string; phase: 'main' | 'recheck'; understood: boolean };

const group = (id: string) => quizGroups.find((g) => g.id === id)!;

function useFocusOnChange(deps: unknown[]) {
  const ref = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    ref.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

function AgeStep({ onAge, onAdult, onPick }: { onAge: (n: number) => void; onAdult: () => void; onPick: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  return (
    <div className="age-step">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const n = Number(value);
          if (!value.trim() || !Number.isInteger(n) || n < 5 || n > 110) {
            setError('Enter your age as a whole number, for example 19.');
            return;
          }
          setError('');
          onAge(n);
        }}
      >
        <label htmlFor="age-input" className="age-label">
          How old are you?
        </label>
        <p className="small muted" id="age-help">
          Your age is used only to choose questions that fit you. It stays in this tab, is not stored or sent, and is cleared when
          you refresh or reset.
        </p>
        <div className="age-row">
          <input
            id="age-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={3}
            value={value}
            aria-describedby={`age-help${error ? ' age-error' : ''}`}
            aria-invalid={!!error}
            onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ''))}
          />
          <button type="submit" className="btn">
            Continue
          </button>
        </div>
        {error && (
          <p id="age-error" className="age-error" role="alert">
            {error}
          </p>
        )}
      </form>
      <div className="age-alt">
        <button type="button" className="btn-text" onClick={onAdult}>
          I’m a parent, teacher or staff member
        </button>
        <span aria-hidden="true"> · </span>
        <button type="button" className="btn-text" onClick={onPick}>
          Prefer not to say — let me choose a group
        </button>
      </div>
    </div>
  );
}

function GroupPicker({ onPick }: { onPick: (g: QuizGroup) => void }) {
  return (
    <ul className="quiz-groups" role="list">
      {quizGroups.map((g) => (
        <li key={g.id} className={`quiz-group ${g.available ? '' : 'is-unavailable'}`}>
          <div className="qg-main">
            <p className="qg-ages">{g.ages}</p>
            <h3 className="qg-label">{g.label}</h3>
            <p>{g.description}</p>
            {!g.available && <p className="qg-reason">{g.unavailableReason}</p>}
          </div>
          <div className="qg-action">
            {g.available ? (
              <button type="button" className="btn" onClick={() => onPick(g)}>
                Choose
              </button>
            ) : (
              <span className="pill pill-warn">
                <span aria-hidden="true">○</span> Not available
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function LessonCard({ lesson, compact = false }: { lesson: Lesson; compact?: boolean }) {
  const sc = scenarioById[lesson.scenarioId];
  return (
    <aside className={`lesson ${compact ? 'lesson-compact' : ''}`} aria-label={`Short lesson: ${lesson.title}`}>
      <p className="lesson-tag">Short lesson · {topicById[lesson.topicId]?.title}</p>
      <h3 className="lesson-title">{lesson.title}</h3>
      <p className="lesson-key">{lesson.keyIdea}</p>
      <ul>
        {lesson.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p className="lesson-try">
        <strong>Try saying:</strong> {lesson.trySaying}
      </p>
      {!compact && sc && (
        <p className="small">
          Practise it: <Link to={`/practice/${sc.id}`}>{sc.title}</Link> ·{' '}
          <Link to="/learn" state={{ topic: lesson.topicId }}>
            Read the full theme
          </Link>
        </p>
      )}
    </aside>
  );
}

function QuestionView({
  q,
  index,
  total,
  phase,
  onDone,
}: {
  q: QuizQuestion;
  index: number;
  total: number;
  phase: 'main' | 'recheck';
  onDone: (understood: boolean) => void;
}) {
  const [choice, setChoice] = useState('');
  const [checked, setChecked] = useState(false);
  const [firstTry, setFirstTry] = useState<boolean | null>(null);
  const [hint, setHint] = useState(false);
  const promptRef = useRef<HTMLSpanElement>(null);
  const fbRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => promptRef.current?.focus(), []);
  useEffect(() => {
    if (checked) fbRef.current?.focus();
  }, [checked]);
  const right = choice === q.correct;
  const lesson = lessons[q.topicId];

  return (
    <div className="player-stage">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!choice || checked) return;
          setChecked(true);
          if (firstTry === null) setFirstTry(choice === q.correct);
        }}
      >
        <fieldset className="quiz-fieldset">
          <legend>
            <span className="quiz-count">
              {phase === 'recheck' ? 'Check again' : 'Question'} {index + 1} of {total}
            </span>
            <span className="quiz-prompt" ref={promptRef} tabIndex={-1}>
              {q.prompt}
            </span>
          </legend>
          <ul className="options" role="list">
            {q.options.map((o, n) => {
              const state = checked ? (o.id === q.correct && right ? 'is-correct' : o.id === choice ? 'is-wrong' : 'is-dim') : choice === o.id ? 'is-picked' : '';
              return (
                <li key={o.id}>
                  <label className={`option quiz-option ${state}`}>
                    <input type="radio" name={q.id} value={o.id} checked={choice === o.id} disabled={checked} onChange={() => setChoice(o.id)} />
                    <span className="option-letter" aria-hidden="true">
                      {String.fromCharCode(65 + n)}
                    </span>
                    <span>{o.text}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
        {!checked && (
          <div className="btn-row">
            <button type="submit" className="btn" disabled={!choice}>
              Check answer
            </button>
            {q.hint && (
              <button type="button" className="btn-text" aria-expanded={hint} onClick={() => setHint((h) => !h)}>
                {hint ? 'Hide hint' : 'Show a hint'}
              </button>
            )}
          </div>
        )}
        {!checked && hint && q.hint && <p className="quiz-hint">{q.hint}</p>}
      </form>

      {checked && (
        <div className="quiz-feedback">
          {right ? (
            <>
              <h3 className="fb-h" ref={fbRef} tabIndex={-1}>
                <span className="kind kind-reasonable">
                  <span aria-hidden="true">✓</span> That matches
                </span>
              </h3>
              <p className="quiz-expl">{q.explanation}</p>
              {firstTry === false && <p className="small muted">You found it after the lesson — that topic will appear in your learning plan.</p>}
            </>
          ) : (
            <>
              <h3 className="fb-h" ref={fbRef} tabIndex={-1}>
                <span className="kind kind-partial">
                  <span aria-hidden="true">~</span> Not quite — here’s the idea behind it
                </span>
              </h3>
              <p className="quiz-expl">{q.explanation}</p>
              {lesson && <LessonCard lesson={lesson} compact />}
            </>
          )}
          <div className="btn-row">
            {!right && (
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => {
                  setChecked(false);
                  setChoice('');
                }}
              >
                Try this question again
              </button>
            )}
            <button type="button" className="btn" onClick={() => onDone(!!firstTry)}>
              {right ? 'Next' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Plan({ g, results, onRestart, onChangeAge }: { g: QuizGroup; results: Result[]; onRestart: () => void; onChangeAge: () => void }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const topicIds = Array.from(new Set(results.map((r) => r.topicId)));
  const status = (t: string) => {
    const main = results.filter((r) => r.topicId === t && r.phase === 'main');
    const re = results.filter((r) => r.topicId === t && r.phase === 'recheck');
    if (main.every((r) => r.understood)) return 'understood';
    if (re.length && re.every((r) => r.understood)) return 'learned';
    return 'practise';
  };
  const order = { practise: 0, learned: 1, understood: 2 } as const;
  const sorted = [...topicIds].sort((a, b) => order[status(a)] - order[status(b)]);
  const label = { practise: 'Keep practising', learned: 'Learned today', understood: 'Already clear' } as const;
  const cls = { practise: 'pill-warn', learned: 'pill-mid', understood: 'pill-ok' } as const;
  const sym = { practise: '○', learned: '◐', understood: '●' } as const;

  return (
    <div className="plan">
      <h2 ref={ref} tabIndex={-1}>
        Your learning plan
      </h2>
      <p className="measure">
        Based on your answers in the <strong>{g.label.toLowerCase()}</strong> check. Topics you might want to spend more time on
        come first. This is a plan for learning, not a score, and it says nothing about you as a person.
      </p>
      <ol className="plan-list">
        {sorted.map((t) => {
          const s = status(t);
          const l = lessons[t];
          const sc = l && scenarioById[l.scenarioId];
          return (
            <li key={t} className={`plan-item plan-${s}`}>
              <div className="plan-head">
                <h3>{topicById[t]?.title}</h3>
                <span className={`pill ${cls[s]}`}>
                  <span aria-hidden="true">{sym[s]}</span> {label[s]}
                </span>
              </div>
              {l && (
                <>
                  <p className="plan-key">{l.keyIdea}</p>
                  {s !== 'understood' && (
                    <ul>
                      {l.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                  <p className="lesson-try">
                    <strong>Try saying:</strong> {l.trySaying}
                  </p>
                  <div className="plan-actions">
                    {sc && (
                      <Link className={s === 'understood' ? 'btn btn-quiet' : 'btn'} to={`/practice/${sc.id}`}>
                        Practise: {sc.title}
                      </Link>
                    )}
                    <Link className="btn-text" to="/learn" state={{ topic: t }}>
                      Read the full theme
                    </Link>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <div className="btn-row">
        <button type="button" className="btn btn-quiet" onClick={onRestart}>
          Start this check again
        </button>
        <button type="button" className="btn-text" onClick={onChangeAge}>
          Change age or group
        </button>
      </div>
    </div>
  );
}

export default function Quiz() {
  const [step, setStep] = useState<Step>('age');
  const [age, setAge] = useState<number | null>(null);
  const [gid, setGid] = useState<string>('');
  const [queue, setQueue] = useState<QuizQuestion[]>([]);
  const [phase, setPhase] = useState<'main' | 'recheck'>('main');
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const headRef = useFocusOnChange([step]);

  const start = (id: string) => {
    setGid(id);
    setQueue(group(id).questions);
    setPhase('main');
    setIdx(0);
    setResults([]);
    setStep('intro');
  };
  const restartAll = () => {
    setStep('age');
    setAge(null);
    setGid('');
    setResults([]);
  };

  const onAge = (n: number) => {
    setAge(n);
    if (n < 18) setStep('under18');
    else if (n <= 19) start('first-years');
    else if (n <= 22) start('senior-students');
    else setStep('role');
  };

  const answered = (understood: boolean) => {
    const q = queue[idx];
    const next = [...results, { qid: q.id, topicId: q.topicId, phase, understood }];
    setResults(next);
    if (idx + 1 < queue.length) {
      setIdx(idx + 1);
      return;
    }
    if (phase === 'main') {
      const missed = Array.from(new Set(next.filter((r) => !r.understood).map((r) => r.topicId))).filter((t) => rechecks[t]);
      if (missed.length) {
        setQueue(missed.map((t) => rechecks[t]));
        setPhase('recheck');
        setIdx(0);
        setStep('recheck-intro');
        return;
      }
    }
    setStep('plan');
  };

  const g = gid ? group(gid) : null;
  const missedCount = results.filter((r) => r.phase === 'main' && !r.understood).length;

  return (
    <div className="page">
      <PageHeader eyebrow="Learn by doing" title="A short check that teaches as you go.">
        <p>
          Tell us your age and we’ll choose questions that fit. When an answer doesn’t match, you’ll get a short lesson, and we’ll
          check that idea again with a new situation. At the end you get a learning plan with scenarios to practise.
        </p>
        <p className="small muted">
          No timer, no score, nothing stored. This checks understanding of ideas; it does not assess anyone’s character or predict
          behaviour. Draft content — professional review pending.
        </p>
      </PageHeader>

      <section className="wrap section quiz-shell" aria-label="Learning check">
        {step === 'age' && (
          <>
            <Eyebrow>Step 1 · Your age</Eyebrow>
            <h2 className="sr-only" ref={headRef} tabIndex={-1}>
              Your age
            </h2>
            <AgeStep onAge={onAge} onAdult={() => start('supporting-adults')} onPick={() => setStep('pick')} />
          </>
        )}

        {step === 'pick' && (
          <>
            <Eyebrow>Choose a group</Eyebrow>
            <h2 ref={headRef} tabIndex={-1} className="step-h">
              Which group fits you best?
            </h2>
            <GroupPicker onPick={(gg) => start(gg.id)} />
            <button type="button" className="btn-text" onClick={restartAll}>
              Back
            </button>
          </>
        )}

        {step === 'under18' && (
          <div className="state-panel">
            <h2 ref={headRef} tabIndex={-1}>
              This check isn’t available for under-18s yet
            </h2>
            <p>
              SAMMAN’s first programme is designed for adults aged 18–22. Content for younger people has to be created separately,
              with specialist review and safeguarding — not adapted from adult material. That work hasn’t been done yet, so we
              won’t show you these questions.
            </p>
            <p>If something is worrying you, you can talk to a trusted adult. Support information is available here:</p>
            <div className="btn-row">
              <Link className="btn" to="/questions-support" state={{ focus: 'support' }}>
                Support information
              </Link>
              <button type="button" className="btn-text" onClick={restartAll}>
                I entered the wrong age
              </button>
            </div>
          </div>
        )}

        {step === 'role' && (
          <div className="state-panel">
            <Eyebrow>Step 2 · Your role</Eyebrow>
            <h2 ref={headRef} tabIndex={-1}>
              Which describes you?
            </h2>
            <p className="muted">You entered {age}. Pick the questions that fit why you’re here.</p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => start('senior-students')}>
                I’m a student
              </button>
              <button type="button" className="btn btn-quiet" onClick={() => start('supporting-adults')}>
                I’m a parent, teacher or staff member
              </button>
            </div>
          </div>
        )}

        {step === 'intro' && g && (
          <div className="state-panel">
            <Eyebrow>{g.ages}</Eyebrow>
            <h2 ref={headRef} tabIndex={-1}>
              Your check: {g.label.toLowerCase()}
            </h2>
            <p>{g.description}</p>
            <ol className="how-list">
              <li>Answer {g.questions.length} short questions about fictional situations.</li>
              <li>If an answer doesn’t match, read a one-minute lesson on the idea behind it.</li>
              <li>Check those ideas again with new situations.</li>
              <li>Get a learning plan with scenarios to practise.</li>
            </ol>
            <p className="small muted">You can stop at any time. Support information is always one click away at the top of the page.</p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => setStep('quiz')}>
                Begin
              </button>
              <button type="button" className="btn-text" onClick={restartAll}>
                Change age or group
              </button>
            </div>
          </div>
        )}

        {step === 'quiz' && g && (
          <div className="quiz-runner">
            <div className="quiz-top">
              <p className="stage-count">
                {phase === 'recheck' ? 'Checking again' : g.label} · {g.ages}
              </p>
              <button type="button" className="btn-text" onClick={restartAll}>
                Start over
              </button>
            </div>
            <div className="quiz-progress" aria-hidden="true">
              {queue.map((x, n) => (
                <span key={x.id} className={n < idx ? 'is-done' : n === idx ? 'is-now' : ''} />
              ))}
            </div>
            <QuestionView key={`${phase}-${queue[idx].id}`} q={queue[idx]} index={idx} total={queue.length} phase={phase} onDone={answered} />
          </div>
        )}

        {step === 'recheck-intro' && (
          <div className="state-panel">
            <Eyebrow>Step 3 · Check again</Eyebrow>
            <h2 ref={headRef} tabIndex={-1}>
              Let’s revisit {queue.length === 1 ? 'one idea' : `${queue.length} ideas`}
            </h2>
            <p>
              {missedCount === 1 ? 'One answer' : `${missedCount} answers`} pointed to ideas worth another look. Here they are again
              in new situations, so you can apply what the lessons covered.
            </p>
            <ul>
              {queue.map((q) => (
                <li key={q.id}>{lessons[q.topicId]?.title ?? topicById[q.topicId]?.title}</li>
              ))}
            </ul>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => setStep('quiz')}>
                Check again
              </button>
              <button type="button" className="btn-text" onClick={() => setStep('plan')}>
                Skip to my learning plan
              </button>
            </div>
          </div>
        )}

        {step === 'plan' && g && <Plan g={g} results={results} onRestart={() => start(g.id)} onChangeAge={restartAll} />}
      </section>
    </div>
  );
}
