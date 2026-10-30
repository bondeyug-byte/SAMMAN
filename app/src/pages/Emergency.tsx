import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HELP_DIRECTORY } from '../guide/config';
import { PLAIN_HELP, shareLocation, shareText } from '../guide/services';
import { CALLS, useHelp } from '../help/HelpSheet';
import { Eyebrow, PageHeader } from '../components/ui';

const HOLD_MS = 3000;

/** Press and hold for 3 seconds, so it can't fire from a pocket. Works with touch, mouse and keyboard. */
function SosButton({ onDone, onShort }: { onDone: () => void; onShort: () => void }) {
  const btn = useRef<HTMLButtonElement>(null);
  const raf = useRef(0);
  const start = useRef(0);
  const [holding, setHolding] = useState(false);

  const reset = () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    setHolding(false);
    btn.current?.style.setProperty('--p', '0');
  };
  const tick = (now: number) => {
    const p = Math.min(1, (now - start.current) / HOLD_MS);
    btn.current?.style.setProperty('--p', String(p));
    if (p >= 1) {
      reset();
      navigator.vibrate?.(150);
      onDone();
    } else raf.current = requestAnimationFrame(tick);
  };
  const begin = (e: { preventDefault: () => void }) => {
    if (raf.current) return;
    e.preventDefault();
    start.current = performance.now();
    setHolding(true);
    raf.current = requestAnimationFrame(tick);
  };
  const cancel = () => {
    if (!raf.current) return;
    reset();
    onShort();
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <button
      ref={btn}
      type="button"
      className={`sos-big hold ${holding ? 'holding' : ''}`}
      aria-describedby="sos-hint"
      onPointerDown={begin}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) begin(e); }}
      onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') cancel(); }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="ring" aria-hidden="true" />
      SOS
    </button>
  );
}

export default function Emergency() {
  const { openHelp } = useHelp();
  const [hint, setHint] = useState('');
  const [msg, setMsg] = useState('');
  const [plain, setPlain] = useState(false);
  const groups = [...new Set(HELP_DIRECTORY.map((e) => e.group))];

  return (
    <div className="page">
      <PageHeader eyebrow="Emergency" title="Emergency and helplines">
        <p>Calls go through your phone. SAMMAN does not contact anyone for you.</p>
      </PageHeader>

      <section className="wrap section emergency" aria-label="Emergency actions">
        <div className="sos-stage">
          <SosButton onDone={() => { setHint(''); openHelp(); }} onShort={() => setHint('Keep holding for 3 seconds to open SOS options.')} />
          <p id="sos-hint">Press and hold for 3 seconds to see your options.</p>
          <p className="status sos-msg" role="status" aria-live="polite">
            {hint}
          </p>
        </div>
        <div className="em-tiles">
          {CALLS.map((c) => (
            <a key={c.dial} className={`em-tile ${c.urgent ? 'urgent' : ''}`} href={`tel:${c.dial}`}>
              <strong>{c.dial}</strong>
              <span>{c.sub}</span>
            </a>
          ))}
          <button type="button" className="em-tile" id="em-share" onClick={() => shareLocation(setMsg, () => setPlain(true))}>
            <strong>Share</strong>
            <span>My location</span>
          </button>
        </div>
        <p id="em-msg" className="status" role="status" aria-live="polite">
          {msg}
        </p>
        {plain && (
          <button type="button" id="em-plain" className="btn btn-quiet" onClick={() => shareText(PLAIN_HELP, setMsg, 'Message shared.')}>
            Send “I need help” without my location
          </button>
        )}
      </section>

      <section className="wrap section" id="directory" aria-labelledby="dir-h">
        <Eyebrow>Helplines</Eyebrow>
        <h2 id="dir-h">Verified helplines</h2>
        <p className="small muted">Only numbers confirmed from an official or operator source are listed. Check them again before relying on them.</p>
        {groups.map((g) => (
          <div key={g} className="dir-group">
            <h3 className="sup-group-h">{g}</h3>
            {HELP_DIRECTORY.filter((e) => e.group === g).map((e) => (
              <div key={e.name} className="entry">
                <h4>{e.name}</h4>
                <p>{e.purpose}</p>
                <div className="contacts">
                  {e.contacts.map((c) =>
                    c.dial ? (
                      <a key={c.label} className="btn" href={`tel:${c.dial}`}>
                        {c.label}
                      </a>
                    ) : (
                      <a key={c.label} className="btn btn-quiet" href={c.url} target="_blank" rel="noopener noreferrer">
                        {c.label}
                      </a>
                    ),
                  )}
                </div>
                <p className="small muted">
                  Source: {e.source}.{e.note ? ` ${e.note}` : ''}
                </p>
              </div>
            ))}
          </div>
        ))}
        <h3 className="sup-group-h">Online harassment and consent</h3>
        <p>
          The <Link to="/learn">Learn</Link> section covers deepfakes, image sharing, consent and how to support a friend. For more
          services and their verification status, see <Link to="/questions-support">Questions and support</Link>.
        </p>
      </section>
    </div>
  );
}
