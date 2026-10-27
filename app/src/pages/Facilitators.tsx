import { useState } from 'react';
import { Link } from 'react-router-dom';
import { contentReviewChecklist, groundRules, guidance, postSessionPrompts, preparationChecklist, whatIfs } from '../content/facilitator';
import { sessions } from '../content/programme';
import { scenarioById } from '../content/scenarios';
import { Disclosure, Eyebrow, KindBadge, PageHeader } from '../components/ui';
import { useDemo } from '../state/DemoState';

const sections = [
  ['prep', 'Preparation'],
  ['agendas', 'Agendas'],
  ['rules', 'Ground rules'],
  ['review', 'Content review'],
  ['guidance', 'Guidance'],
  ['whatif', 'What if this happens?'],
  ['after', 'After the session'],
];

function WhatIfSim() {
  const [sel, setSel] = useState(whatIfs[0].id);
  const [pick, setPick] = useState<number | null>(null);
  const w = whatIfs.find((x) => x.id === sel)!;
  return (
    <div className="whatif">
      <div className="whatif-list" role="tablist" aria-label="Situations">
        {whatIfs.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={sel === x.id}
            className="whatif-tab"
            onClick={() => {
              setSel(x.id);
              setPick(null);
            }}
          >
            {x.title}
          </button>
        ))}
      </div>
      <div className="whatif-panel" role="tabpanel" aria-label={w.title} key={w.id}>
        <p className="small">
          <span className="fiction-label">Fictional situation</span>
        </p>
        <p className="whatif-situation">{w.situation}</p>
        <p className="question-sm">What do you do?</p>
        <ul className="options" role="list">
          {w.options.map((o, i) => (
            <li key={o.label}>
              <button type="button" className={`option ${pick === i ? 'is-picked' : ''}`} aria-pressed={pick === i} onClick={() => setPick(i)}>
                <span className="option-letter" aria-hidden="true">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{o.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div aria-live="polite">
          {pick !== null && (
            <div className="whatif-feedback">
              <KindBadge kind={w.options[pick].kind} />
              <p>{w.options[pick].feedback}</p>
              <p className="procedure">
                <strong>Local procedure required:</strong> {w.procedureNote}
              </p>
              <button type="button" className="btn-text" onClick={() => setPick(null)}>
                Try a different response
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Facilitators() {
  const { checks, toggleCheck, reflections, setReflection } = useDemo();
  const [printView, setPrintView] = useState(false);
  const done = preparationChecklist.filter((c) => checks[c.id]).length;

  return (
    <div className={`page ${printView ? 'print-view' : ''}`}>
      <PageHeader eyebrow="Facilitator toolkit" title="Prepared facilitators, bounded roles.">
        <p>
          Practical, non-clinical guidance for running SAMMAN sessions. Facilitators lead discussion; they are not counsellors,
          investigators or legal advisers. The institution’s approved procedures always take precedence.
        </p>
        <p className="small muted">Draft guidance for professional review. This toolkit does not include a chatbot facilitator.</p>
        <div className="btn-row no-print">
          <button type="button" className="btn btn-quiet" aria-pressed={printView} onClick={() => setPrintView((p) => !p)}>
            {printView ? 'Show interactive view' : 'Show print-friendly view'}
          </button>
        </div>
        {printView && (
          <p className="small">
            Print-friendly view shows every section expanded in a single column. Use your browser’s print command to print it.
          </p>
        )}
      </PageHeader>

      <nav className="wrap subnav no-print" aria-label="Toolkit sections">
        {sections.map(([id, l]) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ block: 'start' });
            }}
          >
            {l}
          </a>
        ))}
      </nav>

      <section id="prep" className="wrap section" aria-labelledby="prep-h">
        <Eyebrow>Before</Eyebrow>
        <h2 id="prep-h">Preparation checklist</h2>
        <p className="small muted" role="status">
          {done} of {preparationChecklist.length} checked (this tab only)
        </p>
        <ul className="checklist">
          {preparationChecklist.map((c) => (
            <li key={c.id}>
              <label className="check-row">
                <input type="checkbox" id={`chk-${c.id}`} checked={!!checks[c.id]} onChange={() => toggleCheck(c.id)} />
                <span>{c.text}</span>
              </label>
            </li>
          ))}
        </ul>
        {done === preparationChecklist.length && <p className="complete-note">All preparation items checked. This is a planning aid, not a certification.</p>}
      </section>

      <section id="agendas" className="wrap section" aria-labelledby="ag-h">
        <Eyebrow>Agendas</Eyebrow>
        <h2 id="ag-h">Proposed session agendas</h2>
        <p className="label-line">Proposed delivery structures — not an established effective dose.</p>
        <div className="agendas">
          {sessions.map((s) => (
            <Disclosure
              key={s.id + printView}
              defaultOpen={printView}
              className="session-row"
              summary={
                <>
                  <span className="session-num">{s.number}</span>
                  <span className="session-title">{s.title}</span>
                </>
              }
            >
              <ol className="agenda">
                {s.sequence.map((r) => (
                  <li key={r.time}>
                    <span className="agenda-time">{r.time} min</span>
                    <span>
                      <strong>{r.activity}.</strong> {r.detail}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="small">
                Scenarios: {s.scenarioIds.map((id) => scenarioById[id].title).join(' · ')}
              </p>
            </Disclosure>
          ))}
        </div>
      </section>

      <section id="rules" className="wrap section" aria-labelledby="rules-h">
        <Eyebrow>Ground rules</Eyebrow>
        <h2 id="rules-h">Discussion ground rules</h2>
        <ol className="rules">
          {groundRules.map((r) => (
            <li key={r.rule}>
              <p className="rule-text">{r.rule}</p>
              <p className="muted">{r.why}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="review" className="wrap section" aria-labelledby="rev-h">
        <Eyebrow>Content review</Eyebrow>
        <h2 id="rev-h">Content-review checklist</h2>
        <p className="measure">For reviewers checking scenarios and materials before any delivery. Completing it does not certify the content.</p>
        <ul className="checklist plain">
          {contentReviewChecklist.map((c) => (
            <li key={c}>
              <span aria-hidden="true">□</span> {c}
            </li>
          ))}
        </ul>
      </section>

      <section id="guidance" className="wrap section" aria-labelledby="gd-h">
        <Eyebrow>During</Eyebrow>
        <h2 id="gd-h">Guidance for difficult moments</h2>
        <div className="guidance">
          {guidance.map((g) => (
            <Disclosure key={g.id + printView} defaultOpen={printView} className="guide-row" summary={g.title}>
              <p>{g.intro}</p>
              <ul>
                {g.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className="limit">
                <strong>Limit of the role:</strong> {g.limit}
              </p>
            </Disclosure>
          ))}
        </div>
      </section>

      <section id="whatif" className="wrap section no-print" aria-labelledby="wi-h">
        <Eyebrow>Practice</Eyebrow>
        <h2 id="wi-h">What if this happens?</h2>
        <p className="measure">Choose a situation and a response to see bounded guidance. Locally approved procedures and qualified advice take precedence.</p>
        <WhatIfSim />
      </section>

      <section id="after" className="wrap section" aria-labelledby="af-h">
        <Eyebrow>After</Eyebrow>
        <h2 id="af-h">Post-session reflection</h2>
        <p className="field-warning">
          Kept in this tab only. Record no participant names, disclosures or identifying details.
        </p>
        <div className="reflect-grid">
          {postSessionPrompts.map((p, i) => {
            const key = `fac:${i}`;
            return (
              <div key={p} className="field">
                <label htmlFor={`fac-${i}`}>{p}</label>
                <textarea id={`fac-${i}`} rows={2} defaultValue={reflections[key] ?? ''} onBlur={(e) => setReflection(key, e.target.value)} />
              </div>
            );
          })}
        </div>
        <p className="small">
          See also: <Link to="/questions-support">support information</Link> · <Link to="/institutions">institution readiness</Link>
        </p>
      </section>
    </div>
  );
}
