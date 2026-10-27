import { READINESS_STATUSES, readinessItems, sampleDashboard as d, SUPPRESSION_THRESHOLD, type ReadinessStatus } from '../content/institutions';
import { Eyebrow, PageHeader, StatusPill } from '../components/ui';
import { useDemo } from '../state/DemoState';

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="bar-row">
      <span className="bar-label">{label}</span>
      <span className="bar-track" aria-hidden="true">
        <span className="bar-fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="bar-value">
        {value}
        <span className="muted"> / {max}</span>
      </span>
    </div>
  );
}

function Suppression() {
  // Primary suppression: groups below the threshold.
  // Complementary suppression: the next-smallest group is also hidden so the
  // suppressed value cannot be recovered by subtracting from the published total.
  const total = d.subgroups.reduce((a, b) => a + b.n, 0);
  const small = d.subgroups.filter((g) => g.n < SUPPRESSION_THRESHOLD).map((g) => g.group);
  const sorted = [...d.subgroups].filter((g) => !small.includes(g.group)).sort((a, b) => a.n - b.n);
  const complementary = small.length === 1 && sorted.length ? [sorted[0].group] : [];
  return (
    <div className="table-scroll">
      <table className="data-table narrow">
        <caption>Session 4 attendance by year of study (fictional)</caption>
        <thead>
          <tr>
            <th scope="col">Group</th>
            <th scope="col">Attended</th>
            <th scope="col">Display rule</th>
          </tr>
        </thead>
        <tbody>
          {d.subgroups.map((g) => {
            const hidden = small.includes(g.group) || complementary.includes(g.group);
            return (
              <tr key={g.group}>
                <td>{g.group}</td>
                <td className="num">{hidden ? 'Suppressed' : g.n}</td>
                <td className="small">
                  {small.includes(g.group)
                    ? `Fewer than ${SUPPRESSION_THRESHOLD}`
                    : complementary.includes(g.group)
                      ? 'Also hidden, so the small group can’t be worked out by subtraction'
                      : 'Shown'}
                </td>
              </tr>
            );
          })}
          <tr>
            <th scope="row">Total</th>
            <td className="num">{total}</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function Institutions() {
  const { readiness, setReadiness } = useDemo();
  const counts = READINESS_STATUSES.map((s) => ({
    s,
    n: readinessItems.filter((i) => (readiness[i.id]?.status ?? 'Not reviewed') === s).length,
  }));

  return (
    <div className="page">
      <PageHeader eyebrow="For institutions" title="A course cannot substitute for a responsible institution.">
        <p>
          Before any session runs, the institution needs prepared facilitators, verified support information, clear procedures,
          appropriate follow-up and privacy-conscious evaluation. This page demonstrates how that readiness could be tracked.
        </p>
        <p className="demo-view">
          <strong>Demo view.</strong> This is not secure access control. Anyone can open this page, and nothing entered is saved
          or sent.
        </p>
      </PageHeader>

      <section className="wrap section" aria-labelledby="ready-h">
        <Eyebrow>Readiness checklist</Eyebrow>
        <h2 id="ready-h">Institution readiness (demonstration)</h2>
        <p className="measure">
          Set a status for each item. Statuses describe what has happened to the information — not whether the institution is
          safe or legally compliant. This prototype never issues either label.
        </p>
        <p className="field-warning">Enter role titles only (for example “ICC presiding officer”), never people’s names.</p>
        <p className="tally" role="status" aria-live="polite">
          {counts.map((c) => (
            <span key={c.s}>
              <StatusPill status={c.s} /> {c.n}
            </span>
          ))}
        </p>
        <ol className="readiness">
          {readinessItems.map((item, i) => {
            const v = readiness[item.id] ?? { status: 'Not reviewed' as ReadinessStatus, role: '', date: '' };
            return (
              <li key={item.id} className="ready-row">
                <span className="ready-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="ready-main">
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                  <div className="ready-fields">
                    <div className="field">
                      <label htmlFor={`st-${item.id}`}>Status</label>
                      <select id={`st-${item.id}`} value={v.status} onChange={(e) => setReadiness(item.id, { status: e.target.value as ReadinessStatus })}>
                        {READINESS_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor={`role-${item.id}`}>Responsible role</label>
                      <input id={`role-${item.id}`} type="text" maxLength={60} value={v.role} onChange={(e) => setReadiness(item.id, { role: e.target.value })} placeholder="Role title" />
                    </div>
                    <div className="field">
                      <label htmlFor={`date-${item.id}`}>Next review date</label>
                      <input id={`date-${item.id}`} type="date" value={v.date} onChange={(e) => setReadiness(item.id, { date: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="ready-status">
                  <StatusPill status={v.status} />
                </div>
              </li>
            );
          })}
        </ol>
        <div className="not-here">
          <h3>Not part of this prototype</h3>
          <p>No complaint intake, evidence upload, named allegations, public allegations, or automated escalation to police.</p>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="dash-h">
        <Eyebrow>Sample dashboard</Eyebrow>
        <h2 id="dash-h">Aggregate reporting (fictional)</h2>
        <p className="fiction-banner" role="note">
          <strong>{d.label}.</strong> Every number on this page is invented to show the layout. No pilot has been run.
        </p>
        <p className="measure">
          Each measure is shown separately and never combined into a single score. No individual answers or attitude rankings are
          shown to anyone.
        </p>

        <div className="dash-grid">
          <div className="dash-card">
            <h3>Participation by session</h3>
            <p className="small muted">Of {d.invited} invited (fictional)</p>
            {d.sessions.map((s) => (
              <Bar key={s.name} label={s.name} value={s.attended} max={d.invited} />
            ))}
          </div>
          <div className="dash-card">
            <h3>Scenario completion</h3>
            <p className="small muted">Completed of started; skips shown separately and carry no penalty</p>
            <div className="table-scroll">
              <table className="data-table narrow">
                <thead>
                  <tr>
                    <th scope="col">Scenario</th>
                    <th scope="col">Started</th>
                    <th scope="col">Completed</th>
                    <th scope="col">Skipped</th>
                  </tr>
                </thead>
                <tbody>
                  {d.scenarioCompletion.map((r) => (
                    <tr key={r.name}>
                      <td>{r.name}</td>
                      <td className="num">{r.started}</td>
                      <td className="num">{r.completed}</td>
                      <td className="num">{r.skipped}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="dash-card">
            <h3>Follow-up participation</h3>
            <p className="small muted">Who took part in the optional follow-up — not what they learned</p>
            <Bar label="Responded" value={d.followUp.responded} max={d.followUp.eligible} />
            <p className="small">Low follow-up limits what any result can show.</p>
          </div>
          <div className="dash-card">
            <h3>Learning topics most often revisited</h3>
            <p className="small muted">Counts of “topics to revisit” suggestions across the cohort</p>
            {d.topicsRevisited.map((t) => (
              <Bar key={t.topic} label={t.topic} value={t.count} max={d.topicsRevisited[0].count} />
            ))}
          </div>
          <div className="dash-card wide">
            <h3>Facilitator observations (fictional, paraphrased)</h3>
            <ul>
              {d.observations.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
          <div className="dash-card wide">
            <h3>Small-group reporting</h3>
            <p>
              Groups smaller than {SUPPRESSION_THRESHOLD} are suppressed. Suppressing one cell is not enough when a total is
              published, so a second cell is also hidden. Even then, removing names and suppressing small groups does not
              guarantee anonymity — people can sometimes be identified by combining information.
            </p>
            <Suppression />
          </div>
        </div>
      </section>
    </div>
  );
}
