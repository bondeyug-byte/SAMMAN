import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PLAIN_HELP, shareLocation, shareText } from '../guide/services';

// The Help sheet: quick calls and sharing, reachable from every page (Help button and SOS).
// Calls go through the phone. SAMMAN does not contact anyone.
const HelpCtx = createContext<{ openHelp: () => void } | null>(null);

export function useHelp() {
  const v = useContext(HelpCtx);
  if (!v) throw new Error('useHelp must be used inside HelpProvider');
  return v;
}

export const CALLS = [
  { dial: '112', label: 'Call 112', sub: 'Police, fire, ambulance', urgent: true },
  { dial: '181', label: 'Call 181', sub: 'Women Helpline' },
  { dial: '1098', label: 'Call 1098', sub: 'Child Helpline' },
];

export function HelpProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [msg, setMsg] = useState('');
  const [plain, setPlain] = useState(false);
  const nav = useNavigate();

  const openHelp = useCallback(() => {
    setMsg('');
    setPlain(false);
    const d = ref.current;
    if (d && !d.open) {
      if (typeof d.showModal === 'function') d.showModal();
      else d.setAttribute('open', '');
    }
  }, []);
  const close = () => {
    const d = ref.current;
    if (!d) return;
    if (typeof d.close === 'function') d.close();
    else d.removeAttribute('open');
  };

  // Tapping the dimmed area outside the sheet closes it.
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => {
      if (e.target !== d) return;
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
    };
    d.addEventListener('click', onClick);
    return () => d.removeEventListener('click', onClick);
  }, []);

  return (
    <HelpCtx.Provider value={{ openHelp }}>
      {children}
      <dialog ref={ref} id="help-sheet" className="help-sheet" aria-labelledby="help-title">
        <h2 id="help-title">What do you need?</h2>
        {CALLS.map((c) => (
          <a key={c.dial} className={`call ${c.urgent ? 'urgent' : ''}`} href={`tel:${c.dial}`}>
            {c.label}
            <span>{c.sub}</span>
          </a>
        ))}
        <button type="button" className="call" id="sheet-share" onClick={() => shareLocation(setMsg, () => setPlain(true))}>
          Share my location
          <span>Opens your phone’s share menu</span>
        </button>
        {plain && (
          <button type="button" className="btn btn-quiet sheet-plain" onClick={() => shareText(PLAIN_HELP, setMsg, 'Message shared.')}>
            Send “I need help” without my location
          </button>
        )}
        <p className="status" role="status" aria-live="polite">
          {msg}
        </p>
        <button
          type="button"
          className="btn-text sheet-more"
          onClick={() => {
            close();
            nav('/emergency');
          }}
        >
          More helplines
        </button>
        <button type="button" className="btn btn-quiet sheet-cancel" onClick={close}>
          Cancel
        </button>
      </dialog>
    </HelpCtx.Provider>
  );
}
