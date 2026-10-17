import { useEffect, useMemo, useRef, useState } from 'react';
import { strings } from '../strings';
import type { Tree } from '../tree';
import { quizToHash } from '../url';
import { focusablePlaces } from './doors';
import type { QuizApi } from './useQuiz';

const t = strings.quiz.focus;

const X = <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>;

interface Props { tree: Tree; quiz: QuizApi; onLeave(): void }

/** Focus (mock 21): regions and single places that new places come from first. Nothing changes until Save; Close drops the edits. */
export function FocusScreen({ tree, quiz, onLeave }: Props) {
  const [picked, setPicked] = useState<string[]>(quiz.focus);
  const [cleared, setCleared] = useState<string[] | null>(null); // what Clear removed, for Undo
  const [typed, setTyped] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  const regions = tree.regionsOf(tree.countries[0].id);
  const places = useMemo(() => focusablePlaces(tree), [tree]);
  const toggle = (id: string) => setPicked(picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]);
  const singles = picked.filter((id) => tree.getPlace(id));
  const add = (name: string) => {
    const place = places.find((p) => p.name.toLowerCase() === name.trim().toLowerCase());
    if (!place) return;
    setTyped('');
    if (!picked.includes(place.id)) setPicked([...picked, place.id]);
  };
  return (
    <section className="card glass" aria-labelledby="fh">
      <a href={quizToHash({ sub: null })} className="iconbtn close" aria-label={t.close} onClick={(e) => { e.preventDefault(); onLeave(); }}>{X}</a>
      <div className="body">
        <nav className="kicker crumb" aria-label={t.crumbLabel}><a href={quizToHash({ sub: null })}>{t.crumbQuiz}</a> › <span>{t.heading}</span></nav>
        <h1 id="fh" ref={heading} tabIndex={-1}>{t.heading}</h1>
        <p className="lede">{t.lede}</p>
        <h3>{t.regions}</h3>
        <div className="chips" role="group" aria-label={t.regionsLabel}>
          {regions.map((r) => (
            <button key={r.id} className="chip multi" role="checkbox" aria-checked={picked.includes(r.id)} onClick={() => toggle(r.id)}>{r.name}</button>
          ))}
        </div>
        <h3>{t.places}</h3>
        <div className="search inline">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M13 13l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input
            type="search" list="focus-places" aria-label={t.addLabel} placeholder={t.addPlaceholder} value={typed}
            onChange={(e) => { setTyped(e.target.value); if (places.some((p) => p.name === e.target.value)) add(e.target.value); }}
            onKeyDown={(e) => { if (e.key === 'Enter') add(typed); }}
          />
        </div>
        <datalist id="focus-places">{places.map((p) => <option key={p.id} value={p.name} />)}</datalist>
        <ul className="picked" aria-label={t.pickedLabel}>
          {singles.map((id) => {
            const name = tree.getPlace(id)!.name;
            return <li key={id}>{name} <button className="x" aria-label={t.remove(name)} onClick={() => toggle(id)}>{X}</button></li>;
          })}
        </ul>
        <p className="note">{t.note}</p>
      </div>
      {cleared && (
        <p className="undo foot-undo" role="status">{t.cleared} <button className="linkbtn" onClick={() => { setPicked(cleared); setCleared(null); }}>{t.undo}</button></p>
      )}
      <div className="foot">
        <button className="btn primary" onClick={() => { quiz.setFocus(picked); onLeave(); }}>{picked.length ? t.save : t.saveNone}</button>
        <button className="btn quiet" disabled={!picked.length} onClick={() => { setCleared(picked); setPicked([]); }}>{t.clear}</button>
      </div>
    </section>
  );
}
