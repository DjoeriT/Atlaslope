import { useEffect, useRef, useState } from 'react';
import { strings } from '../strings';
import type { Theme } from './theme';

const t = strings.topBar;

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
}

export function TopBar({ theme, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false);
  const brandRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target) && !brandRef.current?.contains(target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); brandRef.current?.focus(); }
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <>
      <div className="topleft">
        <button ref={brandRef} className="brand glass" aria-haspopup="menu" aria-expanded={open} aria-controls="brand-menu" onClick={() => setOpen(!open)}>
          <b>{strings.appName}</b><small>{strings.brandContext}</small>
        </button>
        <div className="search glass">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M13 13l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input type="search" placeholder={t.searchPlaceholder} aria-label={t.searchLabel} />
        </div>
      </div>
      <div id="brand-menu" ref={menuRef} className="glass menu tl" role="menu" hidden={!open}>
        <button role="menuitem" id="theme" aria-pressed={theme === 'dark'} onClick={onToggleTheme}>
          <span>{t.darkInterface}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" /></svg>
        </button>
      </div>
      <div className="topright">
        <nav className="seg glass" aria-label={t.modeNav}>
          <a href="./" aria-current="page">{t.explore}</a>
          {/* Visible but not yet usable; they arrive in releases 5 and 6. */}
          <button aria-disabled="true" title={t.comingSoon} aria-label={`${t.quiz}, ${t.comingSoon.toLowerCase()}`}>{t.quiz}</button>
          <button aria-disabled="true" title={t.comingSoon} aria-label={`${t.progress}, ${t.comingSoon.toLowerCase()}`}>{t.progress}</button>
        </nav>
      </div>
    </>
  );
}
