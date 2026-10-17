import { useEffect, useRef, useState } from 'react';
import { strings } from '../strings';
import { SearchBox } from '../cards/SearchBox';
import type { Tree } from '../tree';
import type { Selection } from '../url';
import type { Theme } from './theme';

const t = strings.topBar;

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
  tree: Tree;
  onOpen: (to: Selection) => void;
  quizOpen: boolean;
  onQuiz: () => void;
  onExplore: () => void;
  onProgressFile: () => void;
}

export function TopBar({ theme, onToggleTheme, tree, onOpen, quizOpen, onQuiz, onExplore, onProgressFile }: Props) {
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
          <BrandMark /><b>{strings.appName}</b><small>{strings.brandContext}</small>
        </button>
        <SearchBox tree={tree} open={onOpen} />
      </div>
      <div id="brand-menu" ref={menuRef} className="glass menu tl" role="menu" hidden={!open}>
        <button role="menuitem" id="theme" aria-pressed={theme === 'dark'} onClick={onToggleTheme}>
          <span>{t.darkInterface}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" /></svg>
        </button>
        <button role="menuitem" onClick={() => { setOpen(false); onProgressFile(); }}>{t.saveLoad}</button>
      </div>
      <div className="topright">
        <nav className="seg glass" aria-label={t.modeNav}>
          <a href="./" aria-current={quizOpen ? undefined : 'page'} onClick={(e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; e.preventDefault(); onExplore(); }}>{t.explore}</a>
          <button aria-current={quizOpen ? 'page' : undefined} onClick={onQuiz}>{t.quiz}</button>
          {/* Visible but not yet usable; it arrives in a later release. */}
          <button aria-disabled="true" title={t.comingSoon} aria-label={`${t.progress}, ${t.comingSoon.toLowerCase()}`}>{t.progress}</button>
        </nav>
      </div>
    </>
  );
}

/** The logo: vine rows running up a slope, cut from a tile in the theme's accent colour. Decorative; the button's text names it. */
export function BrandMark() {
  return (
    <svg className="mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="mark-tile"><rect width="64" height="64" rx="14" /></clipPath>
        <clipPath id="mark-hill"><path d="M-2 52 C 14 50 30 40 44 26 C 50 20 56 17 66 16 L66 66 L-2 66 Z" /></clipPath>
      </defs>
      <g clipPath="url(#mark-tile)">
        <rect width="64" height="64" fill="var(--accent)" />
        <g clipPath="url(#mark-hill)">
          <rect width="64" height="64" fill="var(--accent-ink)" />
          <g fill="none" stroke="var(--accent)" strokeWidth="3.6" strokeLinecap="round">
            <path d="M8 66 L20 49" /><path d="M22 66 L31 40.5" /><path d="M36 66 L41 30.5" /><path d="M50 66 L51 22.5" /><path d="M64 66 L61 17" />
          </g>
        </g>
      </g>
    </svg>
  );
}
