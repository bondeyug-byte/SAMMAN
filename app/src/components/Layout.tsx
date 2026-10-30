import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDemo, type TextSize } from '../state/DemoState';

const embedded = typeof window !== 'undefined' && window.name === 'samman-embed';

import { IconBook, IconBuilding, IconCompass, IconDocument, IconGrid, IconLifeRing, IconPeople, IconStart } from './Icons';

// Primary destinations in the left rail (matching the reference design).
const primaryNav = [
  { to: '/', label: 'Discover', end: true, Icon: IconCompass },
  { to: '/practice', label: 'Practise', Icon: IconGrid },
  { to: '/facilitators', label: 'Facilitate', Icon: IconPeople },
  { to: '/questions-support', label: 'Support', Icon: IconLifeRing },
];
// Existing views kept reachable from a quieter secondary group.
const secondaryNav = [
  { to: '/quiz', label: 'Start', long: 'Start with your age', Icon: IconStart },
  { to: '/learn', label: 'Learn', long: 'Learning programme', Icon: IconBook },
  { to: '/institutions', label: 'Institutions', long: 'For institutions', Icon: IconBuilding },
  { to: '/evidence', label: 'Evidence', long: 'Evidence and pilot', Icon: IconDocument },
];

function PrototypeBar({ onLeave, onReset }: { onLeave: () => void; onReset: () => void }) {
  const [about, setAbout] = useState(false);
  const [settings, setSettings] = useState(false);
  const { textSize, setTextSize, showContentNotes, setShowContentNotes } = useDemo();
  const sizes: { v: TextSize; l: string }[] = [
    { v: 'standard', l: 'A' },
    { v: 'large', l: 'A+' },
    { v: 'larger', l: 'A++' },
  ];
  return (
    <div className="proto-bar">
      <div className="proto-bar-inner">
        <button type="button" className="proto-label" aria-expanded={about} aria-controls="about-proto" onClick={() => setAbout((a) => !a)}>
          Interactive prototype <span aria-hidden="true">{about ? '−' : 'ⓘ'}</span>
        </button>
        <div className="proto-actions">
          <button type="button" className="bar-btn" aria-expanded={settings} aria-controls="reading-settings" onClick={() => setSettings((s) => !s)}>
            Reading settings
          </button>
          <button type="button" className="bar-btn" onClick={onReset}>
            Reset demo
          </button>
          <button type="button" className="bar-btn bar-leave" onClick={onLeave}>
            Leave page
          </button>
        </div>
      </div>
      <div id="about-proto" className="proto-about" hidden={!about}>
        <p>
          This demonstration presents a proposed educational programme. Content requires professional review before real-world
          delivery. No real complaints or sensitive disclosures are collected.
        </p>
        <p>
          Everything you choose or type stays in this browser tab’s memory. Nothing is stored or sent. Refreshing the page or
          choosing “Reset demo” clears it. There is no login, analytics or tracking.
        </p>
      </div>
      <div id="reading-settings" className="proto-about" hidden={!settings}>
        <div className="settings-row">
          <fieldset className="seg">
            <legend>Text size</legend>
            {sizes.map((s) => (
              <label key={s.v} className={textSize === s.v ? 'on' : ''}>
                <input type="radio" name="textsize" checked={textSize === s.v} onChange={() => setTextSize(s.v)} />
                <span aria-hidden="true">{s.l}</span>
                <span className="sr-only">{s.v}</span>
              </label>
            ))}
          </fieldset>
          <label className="check-row">
            <input type="checkbox" id="pref-content-notes" checked={showContentNotes} onChange={(e) => setShowContentNotes(e.target.checked)} />
            Ask me before showing scenario text (content notes first)
          </label>
          <p className="settings-lang">
            Language: English. <span className="muted">Marathi and Hindi — planned; reviewed translation required.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function AppSidebar() {
  return (
    <aside className="rail" aria-label="SAMMAN navigation">
      <Link to="/" className="rail-wordmark" aria-label="SAMMAN, Respect in Practice — home">
        SAMMAN
        <span className="rail-dash" aria-hidden="true" />
      </Link>
      <nav aria-label="Main">
        <ul className="rail-list">
          {primaryNav.map(({ to, label, end, Icon }) => (
            <li key={to}>
              <NavLink to={to} end={end} className="rail-item">
                <Icon />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <ul className="rail-list rail-secondary" aria-label="More pages">
          {secondaryNav.map(({ to, label, long, Icon }) => (
            <li key={to}>
              <NavLink to={to} className="rail-item rail-item-sm" title={long}>
                <Icon />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function MobileHeader() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  return (
    <header className="m-header">
      <div className="m-header-inner">
        <Link to="/" className="m-wordmark" aria-label={embedded ? 'Learn — start' : 'SAMMAN — home'}>
          {embedded ? 'Learn' : 'SAMMAN'}
        </Link>
        <Link to="/questions-support" state={{ focus: 'support' }} className="m-support">
          Support
        </Link>
        <button type="button" className="m-menu" aria-expanded={open} aria-controls="m-nav" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <nav id="m-nav" className="m-nav" hidden={!open} aria-label="Main">
        <ul>
          {[...primaryNav.map((n) => ({ ...n, long: n.label })), ...secondaryNav.map((n) => ({ ...n, end: false }))].map(({ to, long, Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end}>
                <Icon size={20} />
                <span>{long}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function Footer({ onReset }: { onReset: () => void }) {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <p className="footer-wm">SAMMAN</p>
          <p>Respect in Practice. An interactive prototype of a proposed prevention-learning programme for college students aged 18–22.</p>
        </div>
        <div>
          <h2 className="footer-h">Prototype status</h2>
          <p>
            Proposed content. Professional review pending. No partnerships, approvals, reviews or results exist. The site does not
            replace legal accountability, professional care or institutional procedures.
          </p>
        </div>
        <div>
          <h2 className="footer-h">Privacy</h2>
          <p>No login, analytics, tracking, uploads or storage. Answers stay in this tab’s memory until refresh or reset.</p>
          <button type="button" className="btn-text on-dark" onClick={onReset}>
            Reset demonstration
          </button>
        </div>
        <div>
          <h2 className="footer-h">Find</h2>
          <ul className="footer-links">
            <li>
              <Link to="/questions-support">Support information</Link>
            </li>
            <li>
              <Link to="/evidence">Sources and evidence register</Link>
            </li>
            <li>
              <Link to="/facilitators">Facilitator toolkit</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function LeaveScreen({ onBack }: { onBack: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="leave-screen" role="dialog" aria-modal="true" aria-labelledby="leave-h" tabIndex={-1} ref={ref}>
      <div className="leave-inner">
        <h1 id="leave-h">Page closed</h1>
        <p>Your answers in this demonstration have been cleared.</p>
        <p className="leave-warning">
          Leaving does not erase browser history, downloads, screenshots, or other activity on your device.
        </p>
        <p className="muted">
          This prototype cannot close your tab. You can close it yourself, or open a neutral site such as{' '}
          <a href="https://www.wikipedia.org" target="_blank" rel="noreferrer">
            wikipedia.org
          </a>
          .
        </p>
        <button type="button" className="btn btn-quiet" onClick={onBack}>
          Return to SAMMAN
        </button>
      </div>
    </div>
  );
}

function ResetConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div className="modal-backdrop" onKeyDown={(e) => e.key === 'Escape' && onCancel()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="reset-h">
        <h2 id="reset-h">Reset the demonstration?</h2>
        <p>This clears your scenario progress, reflections, typed questions, checklist entries and settings in this tab.</p>
        <div className="btn-row">
          <button type="button" className="btn" onClick={onConfirm} ref={ref}>
            Reset demo
          </button>
          <button type="button" className="btn btn-quiet" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Layout() {
  const { reset, resetCount } = useDemo();
  const [leaving, setLeaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [toast, setToast] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    if (!resetCount) return;
    setToast('Demo reset. Your answers have been cleared.');
    const t = window.setTimeout(() => setToast(''), 3500);
    return () => window.clearTimeout(t);
  }, [resetCount]);

  const leave = () => {
    reset();
    setLeaving(true);
    nav('/');
  };

  if (leaving) return <LeaveScreen onBack={() => setLeaving(false)} />;

  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>
        Skip to content
      </a>
      <AppSidebar />
      <div className="shell">
        <PrototypeBar onLeave={leave} onReset={() => setConfirming(true)} />
        <MobileHeader />
        <main id="main" tabIndex={-1}>
          <div key={resetCount}>
            <Outlet />
          </div>
        </main>
        <Footer onReset={() => setConfirming(true)} />
      </div>
      {confirming && (
        <ResetConfirm
          onConfirm={() => {
            reset();
            setConfirming(false);
          }}
          onCancel={() => setConfirming(false)}
        />
      )}
      <div className="toast" role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
