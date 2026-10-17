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
          <b>{strings.appName}</b><small>{strings.brandContext}</small>
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
          <a href="./" aria-current={quizOpen ? undefined : 'page'} onClick={(e) => { if (quizOpen) { e.preventDefault(); onExplore(); } }}>{t.explore}</a>
          <button aria-current={quizOpen ? 'page' : undefined} onClick={onQuiz}>{t.quiz}</button>
          {/* Visible but not yet usable; it arrives in a later release. */}
          <button aria-disabled="true" title={t.comingSoon} aria-label={`${t.progress}, ${t.comingSoon.toLowerCase()}`}>{t.progress}</button>
        </nav>
      </div>
    </>
  );
}
