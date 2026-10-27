import { useState } from 'react';
import { consultation, evidenceRegister } from '../content/evidence';
import type { VerificationStatus } from '../content/types';
import { Eyebrow, PageHeader, StatusPill } from '../components/ui';

const kinds = [
  { k: 'Stakeholder feedback', has: 'Preliminary', d: consultation.wording },
  { k: 'Published research', has: 'Used to inform design', d: 'Reviews and trials, mostly from the US, listed in the evidence register below. None of them evaluates SAMMAN.' },
  { k: 'Design proposals', has: 'This prototype', d: 'Session structure, scenarios, feedback questions and facilitator guidance — all proposals for review and testing.' },
  { k: 'Untested assumptions', has: 'Stated openly', d: 'That the “knowing vs practising” gap exists among participating students; that peer norms are misperceived locally; that scenario practice transfers to new situations.' },
  { k: 'Measured outcomes', has: 'None yet', d: 'No pilot has been run. There are no learner numbers, results or effectiveness findings.' },
];

const measures = [
  { m: 'Recognition of coercion', how: 'Whether participants identify pressure, entitlement and control in new fictional scenarios.', caveat: 'Recognition in a scenario is not behaviour.' },
  { m: 'Quality of reasoning', how: 'Short written explanations rated against a rubric (to be developed and reviewed).', caveat: 'Rubric reliability must be tested; raters must not see names.' },
  { m: 'Safe bystander decision-making', how: 'Choices in new scenarios: whether options chosen are safe and respect the affected person’s choice.', caveat: 'Hypothetical decisions; may not transfer.' },
  { m: 'Retained understanding', how: 'A different set of scenarios at follow-up, 4–8 weeks later.', caveat: 'Comparability of baseline and follow-up scenarios requires expert review.' },
  { m: 'Facilitator delivery feasibility', how: 'Timing, fidelity, facilitator confidence and issues recorded after each session.', caveat: 'Feasibility, not effectiveness.' },
];

const limits = [
  ['Small samples', 'A single-college pilot will be small; differences may be chance.'],
  ['Selective participation', 'Voluntary participants may already be more sympathetic.'],
  ['Social desirability', 'People may choose the response they think is expected.'],
  ['Practice effects', 'Taking a similar test twice can improve scores without learning.'],
  ['Missing follow-up', 'Many people may not take part in follow-up; those who do may differ.'],
  ['Uncertain transfer', 'Better scenario answers may not translate into real-world behaviour.'],
  ['No evidence about offending', 'The pilot will not, and ethically could not easily, measure perpetration.'],
];

const filters: (VerificationStatus | 'All')[] = ['All', 'Official source', 'Secondary', 'Secondary – verify', 'Verification pending', 'Unverified'];

export default function Evidence() {
  const [f, setF] = useState<(typeof filters)[number]>('All');
  const rows = evidenceRegister.filter((r) => f === 'All' || r.status === f);
  return (
    <div className="page">
      <PageHeader eyebrow="Evidence and pilot" title="Build carefully. Test honestly. Claim only what the evidence supports.">
        <p>
          This page separates what has been heard, what has been published, what is proposed, what is assumed and what has been
          measured. So far, nothing about SAMMAN has been measured.
        </p>
      </PageHeader>

      <section className="statement-band tight" aria-label="Key statement">
        <div className="wrap">
          <p className="band-quote">Improved scenario responses do not prove reduced sexual violence.</p>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="kinds-h">
        <Eyebrow>Types of evidence</Eyebrow>
        <h2 id="kinds-h">What we know, and how we know it</h2>
        <dl className="kinds">
          {kinds.map((x) => (
            <div key={x.k}>
              <dt>
                {x.k}
                <span className="kinds-has">{x.has}</span>
              </dt>
              <dd>{x.d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wrap section" aria-labelledby="cons-h">
        <Eyebrow>Consultation</Eyebrow>
        <h2 id="cons-h">Consultation themes</h2>
        <p className="measure lead-sm">{consultation.wording}</p>
        <div className="empty">
          <p>{consultation.themesStatus}</p>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="eval-h">
        <Eyebrow>Proposed evaluation</Eyebrow>
        <h2 id="eval-h">What a pilot would measure</h2>
        <p className="measure">
          Each measure is reported separately — never combined into a “respect score”. No individual answers are shown to
          teachers or peers. Custom questionnaires and scenarios are not validated; existing scales would need cultural adaptation
          and testing in India before use.
        </p>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Measure</th>
                <th scope="col">Proposed approach</th>
                <th scope="col">Caveat</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((m) => (
                <tr key={m.m}>
                  <th scope="row">{m.m}</th>
                  <td>{m.how}</td>
                  <td>{m.caveat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small">
          Baseline and follow-up use different scenarios to reduce practice effects. Whether they are equally difficult requires
          expert review. Measuring perpetration would require separate ethical approval and is not proposed for a first pilot.
        </p>
      </section>

      <section className="wrap section" aria-labelledby="lim-h">
        <Eyebrow>Limitations</Eyebrow>
        <h2 id="lim-h">What could mislead us</h2>
        <dl className="limits">
          {limits.map(([h, p]) => (
            <div key={h}>
              <dt>{h}</dt>
              <dd>{p}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wrap section" aria-labelledby="reg-h">
        <Eyebrow>Evidence register</Eyebrow>
        <h2 id="reg-h">Sources informing the design</h2>
        <p className="measure">
          These sources inform SAMMAN’s design; none of them validates it. Status reflects how far each claim was checked during
          research in October 2026. Several primary papers still need to be read in full.
        </p>
        <div className="filter" role="group" aria-label="Filter by verification status">
          {filters.map((x) => (
            <button key={x} type="button" className={`chip ${f === x ? 'on' : ''}`} aria-pressed={f === x} onClick={() => setF(x)}>
              {x}
            </button>
          ))}
        </div>
        {rows.length === 0 ? (
          <div className="empty">
            <p>No entries with this status.</p>
          </div>
        ) : (
          <div className="table-scroll register">
            <table className="data-table">
              <caption className="sr-only">Evidence register</caption>
              <thead>
                <tr>
                  <th scope="col">Claim</th>
                  <th scope="col">Source</th>
                  <th scope="col">Population</th>
                  <th scope="col">Limitation</th>
                  <th scope="col">Design implication</th>
                  <th scope="col">Verification status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.claim}>
                    <td>{r.claim}</td>
                    <td>
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noreferrer">
                          {r.source}
                        </a>
                      ) : (
                        r.source
                      )}
                    </td>
                    <td>{r.population}</td>
                    <td>{r.limitation}</td>
                    <td>{r.implication}</td>
                    <td>
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
