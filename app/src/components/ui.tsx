import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { KIND_LABEL, type ResponseKind, type VerificationStatus } from '../content/types';

/** Small section label, e.g. "01 / THE GAP". */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

/** Content becomes visible with a small upward movement when it enters the viewport.
 *  Content is visible at rest; only elements below the first screen are prepared for reveal.
 *  Reduced-motion users see everything immediately. */
export function useReveal<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<'rest' | 'pending' | 'in'>('rest');
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) return;
    setState('pending');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('in');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    io.observe(el);
    const fallback = window.setTimeout(() => setState('in'), 6000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);
  return { ref, state };
}

export function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }: { children: ReactNode; as?: 'div' | 'section' | 'li' | 'article'; className?: string; delay?: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<'rest' | 'pending' | 'in'>('rest');
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return; // already on screen: leave at rest
    setState('pending');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('in');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    const fallback = window.setTimeout(() => setState('in'), 4000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);
  const T = Tag as 'div';
  return (
    <T
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal reveal-${state} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </T>
  );
}

/** A thin rule that draws in as it enters the viewport. */
export function Rule() {
  return (
    <Reveal className="rule-wrap">
      <hr className="rule" />
    </Reveal>
  );
}

const statusClass: Record<string, string> = {
  'Official source': 'ok',
  Secondary: 'mid',
  'Secondary – verify': 'mid',
  News: 'mid',
  Unverified: 'warn',
  'Verification pending': 'warn',
  'Not reviewed': 'warn',
  'Information supplied': 'mid',
};

/** Status marker. Uses a symbol and text, never colour alone. */
export function StatusPill({ status }: { status: VerificationStatus | string }) {
  const c = statusClass[status] ?? 'mid';
  const symbol = c === 'ok' ? '●' : c === 'mid' ? '◐' : '○';
  return (
    <span className={`pill pill-${c}`}>
      <span aria-hidden="true">{symbol}</span> {status}
    </span>
  );
}

export function KindBadge({ kind }: { kind: ResponseKind }) {
  const symbol = kind === 'harmful' ? '✕' : kind === 'reasonable' ? '✓' : kind === 'partial' ? '~' : '+';
  return (
    <span className={`kind kind-${kind}`}>
      <span aria-hidden="true">{symbol}</span> {KIND_LABEL[kind]}
    </span>
  );
}

export function ContentNote({ children, title = 'Content note' }: { children: ReactNode; title?: string }) {
  return (
    <aside className="content-note" aria-label={title}>
      <strong>{title}.</strong> {children}
    </aside>
  );
}

export function FictionLabel({ children = 'Fictional example' }: { children?: ReactNode }) {
  return <span className="fiction-label">{children}</span>;
}

/** Accessible disclosure (expand/collapse). */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className = '',
  level = 3,
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  level?: 2 | 3 | 4;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const H = `h${level}` as 'h3';
  return (
    <div className={`disclosure ${open ? 'is-open' : ''} ${className}`}>
      <H className="disclosure-heading">
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          <span className="disclosure-summary">{summary}</span>
          <span className="disclosure-icon" aria-hidden="true">
            {open ? '−' : '+'}
          </span>
        </button>
      </H>
      <div id={id} className="disclosure-body" hidden={!open}>
        {children}
      </div>
    </div>
  );
}

/** Copies text; falls back to selecting it when the clipboard is unavailable. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [msg, setMsg] = useState('');
  return (
    <span className="copy">
      <button
        type="button"
        className="btn-text"
        onClick={(e) => {
          const target = e.currentTarget.parentElement?.previousElementSibling;
          navigator.clipboard
            ?.writeText(text)
            .then(() => setMsg('Copied'))
            .catch(() => {
              if (target) {
                const r = document.createRange();
                r.selectNodeContents(target);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(r);
              }
              setMsg('Selected — copy with your device');
            });
          if (!navigator.clipboard) setMsg('Select the number to copy it');
          window.setTimeout(() => setMsg(''), 2500);
        }}
        aria-label={`Copy ${label}`}
      >
        Copy
      </button>
      <span className="copy-msg" role="status" aria-live="polite">
        {msg}
      </span>
    </span>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="page-header wrap">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {children && <div className="lede">{children}</div>}
    </header>
  );
}
