import { Link, useParams } from 'react-router-dom';
import { scenarioById, scenarios } from '../content/scenarios';
import { topicById } from '../content/topics';
import { sessionById } from '../content/programme';
import ScenarioPlayer from '../components/ScenarioPlayer';
import { Eyebrow, FictionLabel } from '../components/ui';
import { useDemo } from '../state/DemoState';

export default function ScenarioPage() {
  const { scenarioId = '' } = useParams();
  const s = scenarioById[scenarioId];
  const { resetCount } = useDemo();

  if (!s) {
    return (
      <div className="page wrap">
        <div className="state-panel">
          <h1>Scenario not found</h1>
          <p>That scenario doesn’t exist in this prototype. It may have been renamed.</p>
          <Link className="btn" to="/practice">
            Go to the scenario library
          </Link>
        </div>
      </div>
    );
  }

  const idx = scenarios.indexOf(s);
  const next = scenarios[(idx + 1) % scenarios.length];
  const session = sessionById[s.sessionId];

  return (
    <div className="page scenario-page">
      <div className="wrap scenario-layout">
        <aside className="scenario-context" aria-label="Scenario context">
          <p className="crumb">
            <Link to="/practice">Scenario library</Link> / {String(idx + 1).padStart(2, '0')}
          </p>
          <Eyebrow>
            Session {session.number} · {session.title}
          </Eyebrow>
          <h1 className="scenario-title">{s.title}</h1>
          <p>
            <FictionLabel>Fictional scenario</FictionLabel> <span className="muted">· about {s.readingMinutes} minutes</span>
          </p>
          <dl className="context-dl">
            <div>
              <dt>Setting</dt>
              <dd>{s.setting}</dd>
            </div>
            <div>
              <dt>People</dt>
              <dd>
                <ul>
                  {s.characters.map((c) => (
                    <li key={c.name}>
                      <strong>{c.name}</strong> — {c.role}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>Power and relationships</dt>
              <dd>{s.power}</dd>
            </div>
            <div>
              <dt>Your perspective</dt>
              <dd>{s.perspective}</dd>
            </div>
            <div>
              <dt>Topics</dt>
              <dd>{s.topicIds.map((t) => topicById[t].title).join(', ')}</dd>
            </div>
          </dl>
        </aside>
        <div className="scenario-main">
          <ScenarioPlayer key={`${s.id}-${resetCount}`} scenario={s} />
          <p className="next-link">
            Next scenario: <Link to={`/practice/${next.id}`}>{next.title}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
