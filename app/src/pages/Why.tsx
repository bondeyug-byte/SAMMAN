import { useState } from 'react';
import { Link } from 'react-router-dom';
import { layers, loop, statements } from '../content/home';
import { Eyebrow, FictionLabel, PageHeader, Reveal, Rule, useReveal } from '../components/ui';

// "Why SAMMAN": mission, problem hypothesis, responsibility-first principle and approach.
// Content moved here from the homepage so the homepage can stay experience-first.

function InfluenceDiagram() {
  const [active, setActive] = useState(layers[0].id);
  const { ref, state } = useReveal<HTMLDivElement>();
  const layer = layers.find((l) => l.id === active)!;
  const sizes = [70, 120, 170, 220];
  return (
    <div className={`influence reveal-steps-${state}`} ref={ref}>
      <div className="influence-figure">
        <svg viewBox="0 0 460 460" role="img" aria-label="Four nested layers: individual choices at the centre, surrounded by peer expectations, institutional practices and wider social norms.">
          {[...layers].reverse().map((l, ri) => {
            const i = layers.length - 1 - ri;
            const r = sizes[i];
            return (
              <g key={l.id} className={`ring ring-${i} ${active === l.id ? 'is-active' : ''}`} style={{ transitionDelay: `${i * 180}ms` }}>
                <circle cx="230" cy="230" r={r} />
              </g>
            );
          })}
          {layers.map((l, i) => (
            <text key={l.id} x="230" y={i === 0 ? 235 : 230 - sizes[i] + 28} textAnchor="middle" className={`ring-label ring-label-${i} ${active === l.id ? 'is-active' : ''}`} style={{ transitionDelay: `${i * 180 + 120}ms` }}>
              {l.label}
            </text>
          ))}
        </svg>
      </div>
      <div className="influence-panel">
        <div className="layer-tabs" role="tablist" aria-label="Layers of influence">
          {layers.map((l, i) => (
            <button
              key={l.id}
              role="tab"
              id={`tab-${l.id}`}
              aria-selected={active === l.id}
              aria-controls="layer-panel"
              tabIndex={active === l.id ? 0 : -1}
              className="layer-tab"
              onClick={() => setActive(l.id)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                  e.preventDefault();
                  const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1;
                  const n = layers[(i + d + layers.length) % layers.length];
                  setActive(n.id);
                  document.getElementById(`tab-${n.id}`)?.focus();
                }
              }}
            >
              <span className="layer-num">{i + 1}</span> {l.label}
            </button>
          ))}
        </div>
        <div id="layer-panel" role="tabpanel" aria-labelledby={`tab-${layer.id}`} className="layer-detail" key={layer.id}>
          <p className="layer-situation">
            <FictionLabel>Illustrative situation</FictionLabel> {layer.situation.replace(/^Fictional: /, '')}
          </p>
          <dl className="layer-dl">
            <div>
              <dt>The responsibility involved</dt>
              <dd>{layer.responsibility}</dd>
            </div>
            <div>
              <dt>What this project can address</dt>
              <dd>{layer.canAddress}</dd>
            </div>
            <div>
              <dt>What requires broader action</dt>
              <dd>{layer.broader}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function Statements() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="statements">
      <ul className="statement-list" role="list">
        {statements.map((s, i) => (
          <li key={s.text}>
            <button
              type="button"
              className={`statement ${open === i ? 'is-open' : ''}`}
              aria-expanded={open === i}
              aria-controls={`stmt-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="statement-text">“{s.text}”</span>
              <span className="statement-cue" aria-hidden="true">
                {open === i ? '−' : '+'}
              </span>
            </button>
            <div id={`stmt-${i}`} className="statement-body" hidden={open !== i}>
              <p>
                <strong>The assumption:</strong> {s.assumption}
              </p>
              <p>
                <strong>A respectful alternative:</strong> {s.alternative}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="small muted">Fictional statements, shown with an explanation. Select one to see the assumption behind it.</p>
    </div>
  );
}

function LearningLoop() {
  const { ref, state } = useReveal<HTMLOListElement>();
  return (
    <ol className={`loop reveal-steps-${state}`} ref={ref}>
      {loop.map((l, i) => (
        <li key={l.step} style={{ transitionDelay: `${i * 110}ms` }}>
          <span className="loop-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="loop-step">{l.step}</span>
          <span className="loop-detail">{l.detail}</span>
        </li>
      ))}
    </ol>
  );
}

export default function Why() {
  return (
    <div className="page why">
      <PageHeader eyebrow="Why SAMMAN" title="Respect is not a promise. It is a practice.">
        <p>
          SAMMAN is a proposed learning programme for college students aged 18–22. It helps people recognise coercion,
          challenge harmful peer behaviour and practise responsibility, through fictional situations and guided discussion.
        </p>
        <p className="small muted">
          Interactive prototype. It does not replace legal accountability, professional care, institutional procedures or wider
          social change.
        </p>
        <div className="btn-row">
          <Link className="btn btn-accent" to="/practice">
            Try a situation
          </Link>
        </div>
      </PageHeader>

      {/* 2 — The gap */}
      <section id="gap" className="chapter wrap" aria-labelledby="gap-h">
        <Rule />
        <div className="split">
          <div className="split-sticky">
            <Eyebrow>The problem we want to test</Eyebrow>
            <h2 id="gap-h">Knowing the words is not the same as practising respect.</h2>
            <p>
              People may know that harassment and assault are wrong while still excusing pressure, dismissing discomfort, or
              reinforcing harmful behaviour in peer groups.
            </p>
            <p className="hypothesis">
              <strong>This is a hypothesis to investigate,</strong> not a proven description of any student population.
            </p>
          </div>
          <div className="split-flow">
            {[
              ['Recognise the behaviour.', 'Notice pressure, entitlement and control when they are presented as jokes, care or loyalty.'],
              ['Question the excuse.', 'Ask what an explanation assumes, and whose choice it sets aside.'],
              ['Practise a different response.', 'Rehearse realistic, safe responses — privately first, then in discussion.'],
            ].map(([h, p], i) => (
              <Reveal key={h} className="gap-block" delay={i * 80}>
                <span className="gap-num">{i + 1}</span>
                <h3>{h}</h3>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Shared responsibility */}
      <section id="shared" className="chapter wrap" aria-labelledby="shared-h">
        <Rule />
        <Eyebrow>Responsibility first</Eyebrow>
        <h2 id="shared-h">Behaviour happens inside groups, institutions and norms.</h2>
        <p className="measure">
          Choose a layer to see an illustrative situation and where responsibility sits. The layers interact; they are not a
          sequence. A sexist joke and an assault differ in seriousness and consequence, even when they share a harmful
          assumption.
        </p>
        <InfluenceDiagram />
      </section>

      {/* Full-width statement */}
      <section className="statement-band" aria-label="Responsibility statement">
        <div className="wrap">
          <Reveal>
            <p className="band-quote">Women should not have to restrict their lives to prevent someone else’s violence.</p>
            <p className="band-sub">
              People and institutions are responsible for the behaviour they practise, encourage, excuse and tolerate. Other people
              also experience sexual violence; violence against women remains central to this programme.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 4 — Everyday moments */}
      <section id="moments" className="chapter wrap" aria-labelledby="moments-h">
        <Eyebrow>Where practice begins</Eyebrow>
        <h2 id="moments-h">Everyday moments carry assumptions.</h2>
        <Statements />
      </section>

      {/* 5 — Learning loop */}
      <section id="how" className="chapter wrap" aria-labelledby="how-h">
        <Rule />
        <Eyebrow>The proposed approach</Eyebrow>
        <h2 id="how-h">A learning loop, not a lecture.</h2>
        <LearningLoop />
        <p className="small muted">A proposed learning structure — not a validated guarantee of behaviour change.</p>
      </section>

      {/* 9 — Evidence and limits (charcoal) */}
      <section id="evidence" className="dark-band" aria-labelledby="ev-h">
        <div className="wrap">
          <Eyebrow>Evidence and limits</Eyebrow>
          <h2 id="ev-h" className="display-sm">
            Build carefully.
            <br />
            Test honestly.
            <br />
            Claim only what the evidence supports.
          </h2>
          <div className="three-col">
            <div>
              <h3>What we propose</h3>
              <p>A four-session facilitated programme using fictional scenarios, private choices and guided discussion, delivered with institutional support.</p>
            </div>
            <div>
              <h3>What we will test</h3>
              <p>Whether participants recognise coercion, reason about responsibility and choose safe bystander responses — and whether facilitators can deliver it.</p>
            </div>
            <div>
              <h3>What we cannot yet claim</h3>
              <p>That SAMMAN changes behaviour or reduces violence. Published reviews find education shifts attitudes more reliably than behaviour.</p>
            </div>
          </div>
          <Link className="btn btn-on-dark" to="/evidence">
            Read the pilot plan
          </Link>
        </div>
      </section>

    </div>
  );
}
