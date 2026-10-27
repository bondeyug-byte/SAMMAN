import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { qa } from '../content/questions';
import { omittedNote, supportEntries } from '../content/support';
import type { SupportEntry } from '../content/types';
import { CopyButton, Disclosure, Eyebrow, PageHeader, StatusPill } from '../components/ui';
import { useDemo } from '../state/DemoState';

const groups: { id: SupportEntry['group']; title: string }[] = [
  { id: 'urgent', title: 'Immediate danger' },
  { id: 'national', title: 'National helplines' },
  { id: 'local', title: 'Local centres (Mumbai region)' },
  { id: 'online', title: 'Online harms' },
  { id: 'institution', title: 'Your institution' },
];

function Entry({ e }: { e: SupportEntry }) {
  return (
    <article className="support-entry" aria-labelledby={`se-${e.id}`}>
      <div className="se-head">
        <h4 id={`se-${e.id}`}>{e.name}</h4>
        <StatusPill status={e.status} />
      </div>
      <ul className="se-contacts">
        {e.contact.map((c) => (
          <li key={c.value}>
            <span className="se-c-label">{c.label}</span>
            <code className="se-number">{c.value}</code>
            {c.dial && <CopyButton text={c.value} label={`${e.name} ${c.label}`} />}
            {c.dial && (
              <a className="btn-text se-call" href={`tel:${c.dial}`}>
                Call<span className="sr-only"> {c.value}</span>
              </a>
            )}
          </li>
        ))}
      </ul>
      <dl className="se-dl">
        <div>
          <dt>Run by</dt>
          <dd>{e.operator}</dd>
        </div>
        <div>
          <dt>What the source states</dt>
          <dd>{e.stated}</dd>
        </div>
        <div>
          <dt>Not stated</dt>
          <dd>{e.notStated}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>
            <ul>
              {e.source.map((s) => (
                <li key={s.label}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  ) : (
                    s.label
                  )}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Verification</dt>
          <dd>
            {e.statusNote} <span className="muted">Reviewed: {e.reviewed}.</span>
          </dd>
        </div>
      </dl>
    </article>
  );
}

function AskBox() {
  const { questions, addQuestion } = useDemo();
  const [text, setText] = useState('');
  const [last, setLast] = useState('');
  const matches = useMemo(() => {
    if (!last) return [];
    const words = last.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
    return qa.filter((x) => x.keywords.some((k) => words.some((w) => w.includes(k) || k.includes(w)))).slice(0, 3);
  }, [last]);
  return (
    <div className="askbox">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const t = text.trim();
          if (!t) return;
          addQuestion(t);
          setLast(t);
          setText('');
        }}
      >
        <label htmlFor="ask" className="ask-label">
          Type a practice question
        </label>
        <p className="field-warning" id="ask-warn">
          This demonstration is not monitored. Do not enter names, personal incident details, or urgent requests.
        </p>
        <textarea id="ask" rows={3} maxLength={400} value={text} aria-describedby="ask-warn ask-note" onChange={(e) => setText(e.target.value)} />
        <p id="ask-note" className="small muted">
          Your question stays in this tab’s memory and disappears on refresh or reset. It is never sent anywhere, and no one will
          reply. This demonstration does not call itself anonymous: it simply collects nothing.
        </p>
        <button type="submit" className="btn" disabled={!text.trim()}>
          Add to this demo list
        </button>
      </form>
      <div aria-live="polite">
        {last && (
          <div className="ask-result">
            <p>
              <strong>Added to the list below — not sent.</strong> In a real programme, questions would go to a moderated, reviewed
              process.
            </p>
            {matches.length ? (
              <>
                <p>Drafted answers that may be related:</p>
                <ul>
                  {matches.map((m) => (
                    <li key={m.id}>
                      <a href={`#${m.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(m.id)?.scrollIntoView({ block: 'center' }); }}>
                        {m.q}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="muted">No drafted answer matches closely.</p>
            )}
          </div>
        )}
      </div>
      {questions.length > 0 && (
        <div className="typed">
          <h3>Your questions in this tab</h3>
          <ul>
            {questions.map((q) => (
              <li key={q.id}>
                {q.text} <span className="muted small">— not sent · no answer</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function QuestionsSupport() {
  const loc = useLocation();
  useEffect(() => {
    if ((loc.state as { focus?: string } | null)?.focus === 'support') {
      window.setTimeout(() => document.getElementById('support')?.scrollIntoView({ block: 'start' }), 30);
    }
  }, [loc.state]);

  return (
    <div className="page">
      <PageHeader eyebrow="Questions and support" title="Questions and support information">
        <p className="notice">
          <strong>This demonstration is not monitored. It is not an emergency, counselling, or complaint channel.</strong>
        </p>
        <p>
          Support information is available here without login and without completing any lesson.{' '}
          <a
            href="#support"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('support')?.scrollIntoView({ block: 'start' });
            }}
          >
            Go to support information
          </a>
          .
        </p>
      </PageHeader>

      <section className="wrap section" aria-labelledby="qa-h">
        <Eyebrow>Educational Q&amp;A (simulated)</Eyebrow>
        <h2 id="qa-h">Common questions</h2>
        <p className="small muted">Fictional questions. Draft answers awaiting professional review.</p>
        <div className="qa">
          {qa.map((x) => (
            <div id={x.id} key={x.id}>
              <Disclosure summary={x.q} className="qa-row">
                <p className="draft-tag">Draft answer — awaiting professional review</p>
                {x.a.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </Disclosure>
            </div>
          ))}
        </div>
        <AskBox />
      </section>

      <section id="support" className="wrap section" aria-labelledby="sup-h" tabIndex={-1}>
        <Eyebrow>Support information</Eyebrow>
        <h2 id="sup-h">Support directory</h2>
        <div className="sup-intro">
          <p>
            Each entry shows what its source states, what it does not state, and how far it has been verified. Nothing here
            promises availability, response times, outcomes or confidentiality beyond what the service itself states.
          </p>
          <p>
            Call links open your phone app where your device supports it; nothing is dialled automatically. Some browsers block
            them — the number is shown so you can copy it.
          </p>
          <p className="small">
            <StatusPill status="Official source" /> read from an official page or document ·{' '}
            <StatusPill status="Secondary" /> restated by another reliable source ·{' '}
            <StatusPill status="Verification pending" /> not yet confirmed
          </p>
        </div>
        {groups.map((g) => {
          const items = supportEntries.filter((e) => e.group === g.id);
          if (!items.length) return null;
          return (
            <div key={g.id} className="sup-group">
              <h3 className="sup-group-h">{g.title}</h3>
              {items.map((e) => (
                <Entry key={e.id} e={e} />
              ))}
            </div>
          );
        })}
        <p className="small muted">{omittedNote}</p>
      </section>
    </div>
  );
}
