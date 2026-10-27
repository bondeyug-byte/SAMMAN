import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconArrowUpRight, IconChat, IconPause, SymbolEquality, SymbolHand, SymbolSpeak, SymbolSupport } from './Icons';

/* ── Topic symbols ─────────────────────────────────────────────────────── */
// Educational statements, not legal definitions.
export interface HeroTopic {
  id: string;
  label: string;
  statement: string;
  action: { label: string; to: string; state?: unknown };
  Symbol: ComponentType<{ size?: number }>;
}

export const heroTopics: HeroTopic[] = [
  {
    id: 'boundaries',
    label: 'Boundaries',
    statement: 'Respect another person’s choices.',
    action: { label: 'Explore a situation', to: '/practice/after-not-tonight' },
    Symbol: SymbolHand,
  },
  {
    id: 'equality',
    label: 'Equality',
    statement: 'Attention and affection are not owed.',
    action: { label: 'Explore a situation', to: '/practice/just-persistent' },
    Symbol: SymbolEquality,
  },
  {
    id: 'speak-up',
    label: 'Speak up',
    statement: 'Question behaviour that others excuse.',
    action: { label: 'Explore a situation', to: '/practice/outnumbered' },
    Symbol: SymbolSpeak,
  },
  {
    id: 'support',
    label: 'Support',
    statement: 'Listen without blame.',
    action: { label: 'View support options', to: '/questions-support', state: { focus: 'support' } },
    Symbol: SymbolSupport,
  },
];

/** Four symbols. Labels only by default; selecting one reveals a sentence and one action.
 *  Works with click, touch and keyboard (Tab, then Enter or Space). */
export function InteractiveTopicSymbols({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="symbols" role="group" aria-label="Choose a topic">
      <svg className="symbols-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="34" y1="27" x2="66" y2="27" />
        <line x1="34" y1="73" x2="66" y2="73" />
      </svg>
      {heroTopics.map((t) => {
        const on = selected === t.id;
        return (
          <div key={t.id} className={`symbol-cell ${on ? 'is-selected' : ''}`}>
            <button type="button" className="symbol-btn" aria-pressed={on} aria-controls="topic-context" onClick={() => onSelect(t.id)}>
              <span className="symbol-ring">
                <t.Symbol size={64} />
              </span>
              <span className="symbol-label">{t.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

/** Context revealed after a symbol is chosen. Empty (but present for screen readers) until then. */
export function TopicContextStrip({ topic }: { topic: HeroTopic | null }) {
  return (
    <div id="topic-context" className={`context-strip ${topic ? 'is-on' : 'is-empty'}`} aria-live="polite">
      {topic && (
        <div className="cs-inner" key={topic.id}>
          <p className="cs-label">{topic.label}</p>
          <p className="cs-statement">{topic.statement}</p>
          <Link className="cs-action" to={topic.action.to} state={topic.action.state}>
            {topic.action.label} <IconArrowUpRight />
          </Link>
        </div>
      )}
    </div>
  );
}

export function HeroSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const topic = heroTopics.find((t) => t.id === selected) ?? null;
  return (
    <section className="hero2" aria-labelledby="hero-h">
      <div className="hero2-grid">
        <div className="hero2-text">
          <p className="label-rule">
            <span>SAMMAN / Respect in practice</span>
          </p>
          <h1 id="hero-h" className="hero2-h">
            What would <br className="br-desk" />
            you do <br className="br-desk" />
            differently?
          </h1>
          <p className="hero2-sub">Practise consent, challenge harmful behaviour, and take responsibility.</p>
          <div className="hero2-actions">
            <Link className="btn btn-accent" to="/practice">
              Try a situation <IconArrowUpRight />
            </Link>
            <Link className="text-link" to="/why">
              Why SAMMAN? <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
        <InteractiveTopicSymbols selected={selected} onSelect={(id) => setSelected((cur) => (cur === id ? null : id))} />
      </div>
      <TopicContextStrip topic={topic} />
    </section>
  );
}

/* ── Scenario preview (burgundy) ───────────────────────────────────────── */
const previewOptions = [
  {
    id: 'challenge',
    label: 'Challenge the comment calmly',
    feedback:
      'You could name the behaviour and explain why it is not harmless — for example, “That’s not a great joke about her.” Consider the situation and your safety; direct confrontation is not always appropriate, and it is never required.',
  },
  {
    id: 'check-in',
    label: 'Check in and seek support',
    feedback:
      'Private support can be useful. Ask what the person wants rather than assuming, taking over, or sharing their experience with others.',
  },
];

export function PausePanel({ onResume, onLeave }: { onResume: () => void; onLeave: () => void }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="pause-panel" role="region" aria-labelledby="pause-h">
      <h3 id="pause-h" ref={ref} tabIndex={-1}>
        Paused
      </h3>
      <p>Take whatever time you need. Nothing here is timed or scored.</p>
      <div className="btn-row">
        <button type="button" className="btn btn-light" onClick={onResume}>
          Resume
        </button>
        <button type="button" className="btn btn-outline-light" onClick={onLeave}>
          Leave scenario
        </button>
      </div>
    </div>
  );
}

/** Preview: heading, context and one action. Choices appear only after "Explore your options". */
export function ScenarioPreview() {
  const [stage, setStage] = useState<'closed' | 'open' | 'paused' | 'left'>('closed');
  const [choice, setChoice] = useState('');
  const [explored, setExplored] = useState(false);
  const openRef = useRef<HTMLParagraphElement>(null);
  const fbRef = useRef<HTMLDivElement>(null);
  const opt = previewOptions.find((o) => o.id === choice);

  useEffect(() => {
    if (stage === 'open') openRef.current?.focus();
  }, [stage]);
  useEffect(() => {
    if (explored) fbRef.current?.focus();
  }, [explored]);

  const leave = () => {
    setChoice('');
    setExplored(false);
    setStage('left');
  };

  return (
    <section className="scenario-block" aria-labelledby="sp-h">
      <div className="sb-inner">
        <p className="label-rule on-dark">
          <span>Fictional scenario</span>
        </p>
        <h2 id="sp-h" className="sb-h">
          Everyone laughed. Would you?
        </h2>
        <p className="sb-context">A friend dismisses a degrading comment as a joke.</p>

        {stage === 'closed' && (
          <button type="button" className="btn btn-light" onClick={() => setStage('open')}>
            Explore your options <IconArrowRight size={16} />
          </button>
        )}

        {stage === 'left' && (
          <div className="pause-panel">
            <p>You left this scenario. Nothing was recorded.</p>
            <button type="button" className="btn btn-light" onClick={() => setStage('open')}>
              Start again
            </button>
          </div>
        )}

        {stage === 'paused' && <PausePanel onResume={() => setStage('open')} onLeave={leave} />}

        {stage === 'open' && (
          <div className="sb-open">
            <p className="sb-more" ref={openRef} tabIndex={-1}>
              At lunch, a friend jokes that a classmate only got her internship because of her looks. Two people laugh. She isn’t
              there. What could you do?
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (choice) setExplored(true);
              }}
            >
              <fieldset className="sb-fieldset">
                <legend className="sr-only">Choose a possible response</legend>
                {previewOptions.map((o) => (
                  <label key={o.id} className={`sb-option ${choice === o.id ? 'is-on' : ''}`}>
                    <input
                      type="radio"
                      name="sp-choice"
                      value={o.id}
                      checked={choice === o.id}
                      onChange={() => {
                        setChoice(o.id);
                        setExplored(false);
                      }}
                    />
                    <span className="sb-radio" aria-hidden="true" />
                    <span>{o.label}</span>
                  </label>
                ))}
              </fieldset>
              {choice && !explored && (
                <button type="submit" className="btn btn-accent sb-explore">
                  Explore this response <IconArrowRight size={16} />
                </button>
              )}
            </form>

            {explored && opt && (
              <div className="sb-feedback" ref={fbRef} tabIndex={-1} aria-live="polite">
                <p className="sb-fb-tag">Possible approach — depends on context</p>
                <p>{opt.feedback}</p>
                <div className="btn-row">
                  <Link className="btn btn-light" to="/practice/only-a-joke">
                    Continue in the full scenario
                  </Link>
                </div>
              </div>
            )}

            <div className="sb-controls">
              <button type="button" className="btn btn-outline-light" onClick={() => setStage('paused')}>
                <IconPause /> Pause
              </button>
              <button type="button" className="btn btn-outline-light" onClick={leave}>
                Skip
              </button>
              <Link className="btn btn-outline-light" to="/questions-support" state={{ focus: 'support' }}>
                <IconChat /> Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
