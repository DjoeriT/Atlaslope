import { useState } from 'react';
import { strings } from '../strings';
import type { Tree } from '../tree';
import type { Selection } from '../url';
import { selectionOf } from './nav';

const t = strings.topBar;

interface Props {
  tree: Tree;
  open(to: Selection): void;
}

/** The search field. Enter opens the best match; the matches are also a list of links for the keyboard (Tab or arrow down). */
export function SearchBox({ tree, open }: Props) {
  const [text, setText] = useState('');
  const hits = tree.search(text, 8);
  const done = (to: Selection) => { setText(''); open(to); };
  return (
    <div className="search glass">
      <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M13 13l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      <input
        type="search" placeholder={t.searchPlaceholder} aria-label={t.searchLabel} value={text} autoComplete="off"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && hits[0]) done(selectionOf(tree, hits[0]));
          else if (e.key === 'Escape') setText('');
          else if (e.key === 'ArrowDown') { e.preventDefault(); e.currentTarget.parentElement?.querySelector<HTMLElement>('.results a')?.focus(); }
        }}
      />
      {text.trim() !== '' && (
        <ul className="results glass" aria-label={strings.search.results}>
          {hits.length === 0 && <li><p role="status">{strings.search.none}</p></li>}
          {hits.map((h) => (
            <li key={h.level + h.id}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); done(selectionOf(tree, h)); }}
                onKeyDown={(e) => {
                  const li = e.currentTarget.parentElement;
                  if (e.key === 'ArrowDown') { e.preventDefault(); li?.nextElementSibling?.querySelector('a')?.focus(); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); (li?.previousElementSibling?.querySelector('a') ?? li?.closest('.search')?.querySelector('input'))?.focus(); }
                  if (e.key === 'Escape') { li?.closest('.search')?.querySelector('input')?.focus(); setText(''); }
                }}
              >
                <span>{h.name}</span><small>{h.level}</small>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
