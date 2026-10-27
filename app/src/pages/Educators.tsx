import { Link } from 'react-router-dom';
import { Eyebrow, PageHeader } from '../components/ui';

// Hub for educators and institutions. The detailed tools stay on their existing routes.
const requirements = [
  'Trained facilitators, briefed on the institution’s disclosure procedure and supported with a debrief.',
  'Verified support information: Internal Complaints Committee, counselling, medical and security contacts.',
  'Clear, published procedures, including confidentiality limits and protection against retaliation.',
  'A separate procedure for any participant under 18, reviewed by a qualified lawyer.',
  'Privacy-conscious evaluation, with ethics approval before collecting any data.',
];

const safeguards = [
  'No one is asked to disclose personal experiences, role-play trauma or confess anything.',
  'Content notes before every scenario, and a real choice to skip or step out.',
  'Facilitators listen and refer. They do not investigate, counsel or give legal advice.',
  'No scores, rankings or “safe person” certificates. Individual answers are never shown to staff or peers.',
  'No chatbot facilitator, complaint intake, evidence upload or automatic escalation.',
];

export default function Educators() {
  return (
    <div className="page">
      <PageHeader eyebrow="For educators" title="Run SAMMAN responsibly.">
        <p>Resources for facilitators and institutions considering a pilot. All material is draft and needs professional review.</p>
      </PageHeader>

      <section className="wrap section" aria-labelledby="ed-res">
        <Eyebrow>Resources</Eyebrow>
        <h2 id="ed-res" className="sr-only">
          Resources
        </h2>
        <ul className="hub-list">
          <li>
            <Link to="/facilitators" className="hub-link">
              <span className="hub-title">Facilitator toolkit</span>
              <span className="hub-desc">Preparation checklist, agendas, ground rules, guidance for difficult moments, “What if this happens?” practice, and a print-friendly view.</span>
            </Link>
          </li>
          <li>
            <Link to="/institutions" className="hub-link">
              <span className="hub-title">Institution readiness</span>
              <span className="hub-desc">A demonstration checklist and a fictional example of privacy-conscious aggregate reporting.</span>
            </Link>
          </li>
          <li>
            <Link to="/learn" className="hub-link">
              <span className="hub-title">Programme structure</span>
              <span className="hub-desc">Four proposed sessions with objectives, sequences, discussion prompts and follow-up.</span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="wrap section" aria-labelledby="ed-req">
        <Eyebrow>Before any session</Eyebrow>
        <h2 id="ed-req">Delivery requirements</h2>
        <ol className="plain-list">
          {requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </section>

      <section className="wrap section" aria-labelledby="ed-safe">
        <Eyebrow>Built in</Eyebrow>
        <h2 id="ed-safe">Safeguards</h2>
        <ul className="plain-list">
          {safeguards.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p className="small">
          For what the research does and doesn’t support, see <Link to="/evidence">Evidence</Link>.
        </p>
      </section>
    </div>
  );
}
