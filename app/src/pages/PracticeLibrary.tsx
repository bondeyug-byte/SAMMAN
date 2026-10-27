import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { scenarios, isBranching } from '../content/scenarios';
import { topics, topicById } from '../content/topics';
import { useDemo } from '../state/DemoState';
import { PageHeader } from '../components/ui';

const statusText = { 'in-progress': 'In progress', paused: 'Paused', completed: 'Completed', skipped: 'Skipped' } as const;

export default function PracticeLibrary() {
  const { progress } = useDemo();
  const loc = useLocation();
  const [topic, setTopic] = useState<string>((loc.state as { topic?: string } | null)?.topic ?? 'all');
  const list = scenarios.filter((s) => topic === 'all' || s.topicIds.includes(topic));

  return (
    <div className="page">
      <PageHeader eyebrow="Practice" title="Scenario library">
        <p>
          Nine fictional situations. Each one gives you private choices, specific feedback and a chance to try a different
          response. Six include several decisions where one choice leads to another.
        </p>
        <p>
          New here? <Link to="/quiz">Start with your age</Link> for a short check that teaches as you go.
        </p>
        <p className="small muted">
          Branches are illustrations for discussion, not predictions of how people behave. Nothing is scored. You can skip any
          scenario.
        </p>
      </PageHeader>

      <div className="wrap">
        <div className="filter" role="group" aria-label="Filter by topic">
          <button type="button" className={`chip ${topic === 'all' ? 'on' : ''}`} aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>
            All topics
          </button>
          {topics.map((t) => (
            <button key={t.id} type="button" className={`chip ${topic === t.id ? 'on' : ''}`} aria-pressed={topic === t.id} onClick={() => setTopic(t.id)}>
              {t.title}
            </button>
          ))}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {list.length} scenarios shown
        </p>

        {list.length === 0 ? (
          <div className="empty">
            <p>No scenario in this prototype focuses on that topic yet.</p>
            <button type="button" className="btn-text" onClick={() => setTopic('all')}>
              Show all scenarios
            </button>
          </div>
        ) : (
          <ol className="scenario-index">
            {list.map((s) => {
              const p = progress[s.id];
              const n = scenarios.indexOf(s) + 1;
              return (
                <li key={s.id} className="scenario-row">
                  <span className="sr-num" aria-hidden="true">
                    {String(n).padStart(2, '0')}
                  </span>
                  <div className="sr-main">
                    <h2 className="sr-title">
                      <Link to={`/practice/${s.id}`}>{s.title}</Link>
                    </h2>
                    <p>{s.summary}</p>
                    <p className="sr-meta">
                      <span>{s.readingMinutes} min</span>
                      <span>{isBranching(s) ? 'Several decisions' : 'Two decisions'}</span>
                      <span>{s.topicIds.map((t) => topicById[t].title).join(', ')}</span>
                    </p>
                    <p className="sr-note">
                      <span className="note-mark" aria-hidden="true">
                        ▲
                      </span>{' '}
                      Content note: {s.contentNote}
                    </p>
                  </div>
                  <div className="sr-status">{p ? <span className="pill pill-mid">{statusText[p.status]}</span> : null}</div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
