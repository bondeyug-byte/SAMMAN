import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sessions } from '../content/programme';
import { topics } from '../content/topics';
import { scenarioById } from '../content/scenarios';
import { ContentNote, Disclosure, Eyebrow, PageHeader, StatusPill } from '../components/ui';
import { useDemo } from '../state/DemoState';

const principlesVsLaw = [
  { principle: 'Consent is voluntary, specific and ongoing, and can be withdrawn.', law: 'Largely consistent with BNS 2023 s.63, Explanation 2 (“unequivocal voluntary agreement” to the “specific” act). Withdrawal is not expressly stated in the text reviewed.', status: 'Secondary' },
  { principle: 'Consent applies within relationships and marriage.', law: 'Differs: BNS s.63 Exception 2 (marital exception) remains in force; a constitutional challenge is before the Supreme Court.', status: 'Secondary – verify' },
  { principle: 'Respect for consent applies to people of all genders.', law: 'Differs: most BNS sexual-offence sections protect women as victims. IT Act s.66E (privacy) is gender-neutral.', status: 'Secondary – verify' },
  { principle: 'Silence or not resisting is not agreement.', law: 'Consistent with the proviso to BNS s.63, Explanation 2.', status: 'Secondary' },
  { principle: 'For adults, reporting is the affected person’s choice.', law: 'No general legal duty on an ordinary adult to report a sexual offence against another adult was found (BNSS s.33). Different duties apply for children under 18 (POCSO Act) and may apply to some roles.', status: 'Secondary – verify' },
];

function SessionDetail({ s }: { s: (typeof sessions)[number] }) {
  const { reflections, setReflection } = useDemo();
  const key = `session:${s.id}`;
  const [draft, setDraft] = useState(reflections[key] ?? '');
  return (
    <div className="session-detail">
      <p className="session-meta">{s.duration}</p>
      <ContentNote>{s.contentNote}</ContentNote>
      <div className="two-col">
        <div>
          <h4>Objectives</h4>
          <ul>
            {s.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Facilitator preparation</h4>
          <ul>
            {s.preparation.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </div>
      <h4>Proposed sequence</h4>
      <div className="table-scroll">
        <table className="data-table">
          <caption className="sr-only">Proposed sequence for session {s.number}</caption>
          <thead>
            <tr>
              <th scope="col">Minutes</th>
              <th scope="col">Activity</th>
              <th scope="col">Detail</th>
            </tr>
          </thead>
          <tbody>
            {s.sequence.map((r) => (
              <tr key={r.time}>
                <td className="num">{r.time}</td>
                <td>{r.activity}</td>
                <td>{r.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="two-col">
        <div>
          <h4>Linked scenarios</h4>
          <ul>
            {s.scenarioIds.map((id) => (
              <li key={id}>
                <Link to={`/practice/${id}`}>{scenarioById[id].title}</Link>
              </li>
            ))}
          </ul>
          <h4>Discussion prompts</h4>
          <ul>
            {s.discussion.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Take-away practice</h4>
          <p>{s.takeaway}</p>
          <h4>Follow-up</h4>
          <p>{s.followUp}</p>
          <h4>Optional reflection</h4>
          <label htmlFor={`sr-${s.id}`}>{s.reflection}</label>
          <p className="field-warning">Kept in this tab only. Please don’t include names or personal incident details.</p>
          <textarea id={`sr-${s.id}`} rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={() => setReflection(key, draft)} />
        </div>
      </div>
    </div>
  );
}

export default function Learn() {
  const loc = useLocation();
  const target = (loc.state as { topic?: string } | null)?.topic;
  useEffect(() => {
    if (target) window.setTimeout(() => document.getElementById(`topic-${target}`)?.scrollIntoView({ block: 'start' }), 50);
  }, [target]);

  return (
    <div className="page">
      <PageHeader eyebrow="Learning programme" title="Four proposed sessions, ten themes.">
        <p>
          The programme is designed for facilitated groups of consenting adult students. Each session uses fictional scenarios,
          private choices and guided discussion. No one is asked to disclose personal experiences, role-play trauma or confess
          anything, and there is no ranking.
        </p>
        <p className="label-line">Proposed delivery structure — not an established effective dose. Professional review and testing pending.</p>
      </PageHeader>

      <section className="wrap section" aria-labelledby="sessions-h">
        <Eyebrow>Sessions</Eyebrow>
        <h2 id="sessions-h">Proposed session sequence</h2>
        <p className="measure">
          Published reviews suggest single sessions rarely produce lasting change, and longer programmes do better. Four sessions
          with an optional follow-up is a proposal to test, not a known effective amount.
        </p>
        <div className="sessions-list">
          {sessions.map((s) => (
            <Disclosure
              key={s.id}
              level={3}
              className="session-row"
              summary={
                <>
                  <span className="session-num">{s.number}</span>
                  <span className="session-title">{s.title}</span>
                </>
              }
            >
              <SessionDetail s={s} />
            </Disclosure>
          ))}
        </div>
      </section>

      <section className="wrap section" aria-labelledby="themes-h">
        <Eyebrow>Themes</Eyebrow>
        <h2 id="themes-h">What the programme covers</h2>
        <p className="measure">
          Draft educational content. Legal notes are reference points with verification labels, not legal advice.
        </p>
        <div className="themes">
          {topics.map((t) => (
            <div id={`topic-${t.id}`} key={t.id} className="theme-anchor">
              <Disclosure
                key={`${t.id}-${target === t.id}`}
                defaultOpen={target === t.id}
                className="theme-row"
                summary={
                  <>
                    <span className="theme-letter">{t.letter}</span>
                    <span>
                      <span className="theme-title">{t.title}</span>
                      <span className="theme-summary">{t.summary}</span>
                    </span>
                  </>
                }
              >
                <div className="theme-body">
                  <div className="prose">
                    {t.explanation.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <h4>Common justifications to examine</h4>
                  <dl className="justifications">
                    {t.justifications.map((j) => (
                      <div key={j.claim}>
                        <dt>{j.claim}</dt>
                        <dd>{j.response}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="two-col">
                    <div>
                      <h4>Respectful alternatives</h4>
                      <ul>
                        {t.alternatives.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Reflection questions</h4>
                      <ul>
                        {t.reflection.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {t.lawNote && (
                    <aside className="law-note" aria-label="Legal reference note">
                      <p className="law-note-h">Legal reference — requires verification, not legal advice</p>
                      <p>{t.lawNote}</p>
                    </aside>
                  )}
                  <p>
                    <strong>Practise: </strong>
                    {t.scenarioIds.map((id, i) => (
                      <span key={id}>
                        {i > 0 && ', '}
                        <Link to={`/practice/${id}`}>{scenarioById[id].title}</Link>
                      </span>
                    ))}
                  </p>
                </div>
              </Disclosure>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap section" aria-labelledby="law-h">
        <Eyebrow>Principles and law</Eyebrow>
        <h2 id="law-h">General principles are not the same as legal rules.</h2>
        <p className="measure">
          SAMMAN teaches educational principles. Indian law sometimes matches them and sometimes differs. Both are shown
          separately so neither is mistaken for the other. Every legal statement needs review by a qualified lawyer before
          delivery.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <caption className="sr-only">Educational principles compared with Indian law</caption>
            <thead>
              <tr>
                <th scope="col">Educational principle</th>
                <th scope="col">Relationship to Indian law (as researched, October 2026)</th>
                <th scope="col">Verification</th>
              </tr>
            </thead>
            <tbody>
              {principlesVsLaw.map((r) => (
                <tr key={r.principle}>
                  <td>{r.principle}</td>
                  <td>{r.law}</td>
                  <td>
                    <StatusPill status={r.status} />
                    <span className="block small">Legal review required</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="roadmap-h">
        <Eyebrow>Roadmap</Eyebrow>
        <h2 id="roadmap-h">What comes later — and what is not ready</h2>
        <ol className="roadmap">
          <li>
            <span className="rm-stage">Draft prototype</span>
            <h3>Adult college programme (English)</h3>
            <p>This prototype. Content requires professional review before delivery.</p>
          </li>
          <li>
            <span className="rm-stage">Planned</span>
            <h3>Reviewed Marathi and Hindi versions</h3>
            <p>Professional translation and review required. No translation is shown until it is reviewed.</p>
          </li>
          <li>
            <span className="rm-stage">Planned</span>
            <h3>Additional adult settings</h3>
            <p>Workplaces, hostels and student societies, each adapted and reviewed.</p>
          </li>
          <li>
            <span className="rm-stage">Proposed — review pending</span>
            <h3>Parent and educator resources</h3>
            <p>Conversation guides for adults. Draft only after specialist review.</p>
          </li>
          <li>
            <span className="rm-stage">Not available</span>
            <h3>Age-appropriate programmes for children and adolescents</h3>
            <p>
              To be developed separately, never by reusing this adult curriculum. Requires specialist review, safeguarding design,
              permissions, developmental adaptation and checks of mandatory-reporting duties.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}
