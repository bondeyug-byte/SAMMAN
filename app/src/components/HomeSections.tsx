import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import {
  IconArrowRight,
  IconArrowUpRight,
  IconChat,
  IconCompass,
  IconGrid,
  IconLifeRing,
  IconPause,
  IconPeople,
  SymbolEquality,
  SymbolHand,
  SymbolSpeak,
  SymbolSupport,
} from './Icons';

/* ── Topic data for the hero symbols and context strip ─────────────────── */
// Educational statements, not legal definitions.
export interface HeroTopic {
  id: string;
  label: string;
  tooltip: [string, string];
  statement: string;
  scenarioId: string;
  scenarioTitle: string;
  Symbol: ComponentType<{ size?: number }>;
}

export const heroTopics: HeroTopic[] = [
  {
    id: 'boundaries',
    label: 'Boundaries',
    tooltip: ['Respect a boundary.', 'Explore a situation.'],
    statement: 'A relationship never creates an obligation.',
    scenarioId: 'after-not-tonight',
    scenarioTitle: 'After “not tonight”',
    Symbol: SymbolHand,
  },
  {
    id: 'equality',
    label: 'Equality',
    tooltip: ['Choices belong to each person.', 'Explore a situation.'],
    statement: 'Another person’s choices are not yours to control.',
    scenarioId: 'just-persistent',
    scenarioTitle: '“He’s just persistent”',
    Symbol: SymbolEquality,
  },
  {
    id: 'speak-up',
    label: 'Speak up',
    tooltip: ['Question harm safely.', 'Explore a situation.'],
    statement: 'You can question harmful behaviour without joining it.',
    scenarioId: 'outnumbered',
    scenarioTitle: 'Outnumbered',
    Symbol: SymbolSpeak,
  },
  {
    id: 'support',
    label: 'Support',
    tooltip: ['Listen first.', 'Explore a situation.'],
    statement: 'Listen without blame. Ask what support is wanted.',
    scenarioId: 'dont-tell-anyone',
    scenarioTitle: '“Don’t tell anyone”',
    Symbol: SymbolSupport,
  },
];

/* ── InteractiveTopicSymbols ───────────────────────────────────────────── */
export function InteractiveTopicSymbols({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const [tip, setTip] = useState<string | null>(null);
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
            <button
              type="button"
              className="symbol-btn"
              aria-pressed={on}
              aria-describedby={`tip-${t.id}`}
              onClick={() => onSelect(t.id)}
              onMouseEnter={() => setTip(t.id)}
              onMouseLeave={() => setTip((x) => (x === t.id ? null : x))}
              onFocus={() => setTip(t.id)}
              onBlur={() => setTip((x) => (x === t.id ? null : x))}
            >
              <span className="symbol-ring">
                <t.Symbol size={64} />
              </span>
              <span className="symbol-label">
                {t.label}
                {on && <span className="sr-only"> (selected)</span>}
              </span>
            </button>
            <span id={`tip-${t.id}`} role="tooltip" className={`symbol-tip ${tip === t.id ? 'is-on' : ''}`}>
              {t.tooltip[0]}
              <br />
              {t.tooltip[1]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── TopicContextStrip ─────────────────────────────────────────────────── */
export function TopicContextStrip({ topic }: { topic: HeroTopic }) {
  return (
    <div className="context-strip" aria-live="polite">
      <div className="cs-inner" key={topic.id}>
        <p className="cs-label">{topic.label}</p>
        <p className="cs-statement">{topic.statement}</p>
        <Link className="cs-action" to={`/practice/${topic.scenarioId}`}>
          Try this situation <IconArrowUpRight />
          <span className="sr-only">: {topic.scenarioTitle}</span>
        </Link>
      </div>
    </div>
  );
}

/* ── HeroSection ───────────────────────────────────────────────────────── */
export function HeroSection() {
  const [selected, setSelected] = useState(heroTopics[0].id);
  const topic = heroTopics.find((t) => t.id === selected)!;
  return (
    <section className="hero2" aria-labelledby="hero-h">
      <div className="hero2-grid">
        <div className="hero2-text">
          <p className="label-rule">
            <span>Respect in practice</span>
          </p>
          <h1 id="hero-h" className="hero2-h">
            What would <br className="br-desk" />
            you do <br className="br-desk" />
            differently?
          </h1>
          <p className="hero2-sub">Practise consent. Question harmful norms. Take responsibility.</p>
          <div className="hero2-actions">
            <Link className="btn btn-accent" to="/practice">
              Start a scenario <IconArrowUpRight />
            </Link>
            <Link className="text-link" to="/quiz">
              New here? Start with your age <IconArrowRight size={16} />
            </Link>
          </div>
          <p className="hero2-note">Interactive prototype. Proposed first audience: college students aged 18–22.</p>
        </div>
        <InteractiveTopicSymbols selected={selected} onSelect={setSelected} />
      </div>
      <TopicContextStrip topic={topic} />
    </section>
  );
}

/* ── TopicColumns ──────────────────────────────────────────────────────── */
const columns = [
  {
    n: '01',
    Icon: SymbolSpeak,
    h: 'In the group chat',
    p: 'What looks like a joke might not be harmless.',
    to: '/practice',
    topic: 'digital',
    sr: 'Explore group-chat scenarios',
  },
  {
    n: '02',
    Icon: SymbolHand,
    h: 'When someone says no',
    p: 'Respect a boundary. Do not pressure someone to change it.',
    to: '/practice',
    topic: 'consent',
    sr: 'Explore boundaries scenarios',
  },
  {
    n: '03',
    Icon: SymbolSupport,
    h: 'When a friend needs support',
    p: 'Listen without blame. Let them guide the support they want.',
    to: '/practice',
    topic: 'support',
    sr: 'Explore supportive-response scenarios',
  },
];

export function TopicColumns() {
  return (
    <section className="topic-cols" aria-label="Where practice begins">
      {columns.map((c) => (
        <article key={c.n} className="topic-col">
          <div className="tc-head">
            <span className="tc-num">{c.n}</span>
            <c.Icon size={40} />
          </div>
          <h2 className="tc-h">{c.h}</h2>
          <p>{c.p}</p>
          <Link to={c.to} state={{ topic: c.topic }} className="arrow-only">
            <IconArrowRight />
            <span className="sr-only">{c.sr}</span>
          </Link>
        </article>
      ))}
    </section>
  );
}

/* ── ScenarioPreview + PausePanel ─────────────────────────────────────── */
const previewOptions = [
  {
    id: 'challenge',
    label: 'Challenge the comment calmly',
    feedback:
      'You could name the behaviour and explain why it is not harmless — for example, “That’s not a great joke about her.” Consider the situation and your safety; direct confrontation is not always the appropriate option, and it is never required.',
    lens: 'What assumption is operating? That a joke has no effect on what the group finds acceptable.',
  },
  {
    id: 'check-in',
    label: 'Check in and seek support',
    feedback:
      'Private support can be useful. Ask what the person wants rather than assuming, taking over, or sharing their experience with others. You can also raise it with a friend privately later.',
    lens: 'Whose choice matters? The person the comment was about — support follows what they want.',
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

export function ScenarioPreview() {
  const [choice, setChoice] = useState('');
  const [explored, setExplored] = useState(false);
  const [mode, setMode] = useState<'active' | 'paused' | 'left'>('active');
  const fbRef = useRef<HTMLDivElement>(null);
  const opt = previewOptions.find((o) => o.id === choice);

  useEffect(() => {
    if (explored) fbRef.current?.focus();
  }, [explored]);

  return (
    <section className="scenario-block" aria-labelledby="sp-h">
      <div className="sb-inner">
        <p className="label-rule on-dark">
          <span>Practise / 01</span>
        </p>
        <h2 id="sp-h" className="sb-h">
          Everyone laughed. Would you?
        </h2>
        <p className="sb-context">A friend dismisses a degrading comment as a joke.</p>

        {mode === 'paused' && <PausePanel onResume={() => setMode('active')} onLeave={() => setMode('left')} />}

        {mode === 'left' && (
          <div className="pause-panel">
            <p>You left this scenario. Nothing was recorded.</p>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => {
                setChoice('');
                setExplored(false);
                setMode('active');
              }}
            >
              Start again
            </button>
          </div>
        )}

        {mode === 'active' && (
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
        )}

        {mode === 'active' && explored && opt && (
          <div className="sb-feedback" ref={fbRef} tabIndex={-1} aria-live="polite">
            <p className="sb-fb-tag">Possible approach — suitability depends on context</p>
            <p>{opt.feedback}</p>
            <p className="sb-lens">{opt.lens}</p>
            <div className="btn-row">
              <Link className="btn btn-light" to="/practice/only-a-joke">
                Continue in the full scenario
              </Link>
              <button type="button" className="btn-text on-dark" onClick={() => setChoice(choice === 'challenge' ? 'check-in' : 'challenge')}>
                Explore the other response
              </button>
            </div>
          </div>
        )}

        <div className="sb-foot">
          <p className="sb-note">Fictional scenario. Pause or skip at any time.</p>
          <div className="sb-controls">
            <button type="button" className="btn btn-outline-light" onClick={() => setMode(mode === 'paused' ? 'active' : 'paused')} aria-pressed={mode === 'paused'}>
              <IconPause /> Pause
            </button>
            <Link className="btn btn-outline-light" to="/questions-support" state={{ focus: 'support' }}>
              <IconChat /> Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── BottomNavigationStrip ────────────────────────────────────────────── */
const bottomLinks = [
  { label: 'Explore', to: '/learn', Icon: IconCompass },
  { label: 'Practise', to: '/practice', Icon: IconGrid },
  { label: 'Facilitate', to: '/facilitators', Icon: IconPeople },
  { label: 'Support', to: '/questions-support', Icon: IconLifeRing },
];

export function BottomNavigationStrip() {
  return (
    <nav className="bottom-strip" aria-label="Explore SAMMAN">
      <p className="bs-statement">
        Four sessions.
        <br />
        More than awareness.
      </p>
      <ul className="bs-links">
        {bottomLinks.map(({ label, to, Icon }) => (
          <li key={label}>
            <Link to={to} className="bs-link">
              <Icon size={34} />
              <span className="bs-label">{label}</span>
              <IconArrowRight size={16} className="bs-arrow" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
