import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDemo, type TextSize } from '../state/DemoState';

import { IconBook, IconCompass, IconGrid, IconLifeRing, IconPeople } from './Icons';

// Which routes light up each destination.
const sections: Record<string, string[]> = {
  '/': ['/', '/why'],
  '/learn': ['/learn', '/quiz'],
  '/practice': ['/practice'],
  '/educators': ['/educators', '/facilitators', '/institutions'],
  '/questions-support': ['/questions-support'],
};
const isIn = (to: string, path: string) =>
  (sections[to] ?? [to]).some((p) => (p === '/' ? path === '/' : path === p || path.startsWith(p + '/')));

// Concise destinations in the left rail. Secondary pages (Why SAMMAN, Evidence, Privacy,
// facilitator toolkit, institution readiness, age-based check) are reached from pages and the footer.
const primaryNav = [
  { to: '/', label: 'Discover', end: true, Icon: IconCompass },
  { to: '/learn', label: 'Learn', end: false, Icon: IconBook },
  { to: '/practice', label: 'Practise', end: false, Icon: IconGrid },
  { to: '/educators', label: 'Educators', end: false, Icon: IconPeople },
  { to: '/questions-support', label: 'Support', end: false, Icon: IconLifeRing },
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
  const { pathname } = useLocation();
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
              <NavLink to={to} end={end} className={() => `rail-item ${isIn(to, pathname) ? 'active' : ''}`} aria-current={isIn(to, pathname) ? 'page' : undefined}>
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
        <Link to="/" className="m-wordmark" aria-label="SAMMAN — home">
          SAMMAN
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
          {primaryNav.map(({ to, label: long, Icon, end }) => (
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

function Footer() {
  return (
    <footer className="site-footer compact-footer">
      <div className="wrap cf-inner">
        <nav aria-label="Footer">
          <ul className="cf-links">
            <li><Link to="/why">Why SAMMAN</Link></li>
            <li><Link to="/educators">For educators</Link></li>
            <li><Link to="/evidence">Evidence</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
          </ul>
        </nav>
        <p className="cf-note">Educational prototype—not a live support or complaint service.</p>
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
        <Footer />
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
