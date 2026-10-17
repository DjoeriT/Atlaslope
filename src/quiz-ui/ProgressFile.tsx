import { useEffect, useRef, useState } from 'react';
import { placeKnown } from '../quiz';
import { strings } from '../strings';
import { quizToHash } from '../url';
import type { QuizApi } from './useQuiz';

const t = strings.quiz.file;
const SAVED_KEY = 'atlaslope.quiz.filesaved';

const X = <svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>;
const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
const answersIn = (log: QuizApi['log']) => log.filter((e) => e.kind === 'answer').length;

function readSaved(): string {
  try { return localStorage.getItem(SAVED_KEY) ?? ''; } catch { return ''; }
}

type Notice = { kind: 'loaded'; text: string } | { kind: 'undone' } | { kind: 'refused'; text: string };

/** Save or load progress (mock 27): a file is the backup. Loading keeps the earlier progress as a backup, with Undo. */
export function ProgressFile({ quiz, onLeave }: { quiz: QuizApi; onLeave(): void }) {
  const [saved, setSaved] = useState(readSaved);
  const [notice, setNotice] = useState<Notice | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  useEffect(() => heading.current?.focus(), []);
  const answers = answersIn(quiz.log);
  const first = quiz.log[0]?.at;
  const known = Object.values(quiz.state.places).filter(placeKnown).length;
  const newer = quiz.store.status().newerVersion;

  function save() {
    const now = quiz.now();
    const name = `atlaslope-progress-${now.toISOString().slice(0, 10)}.json`;
    const url = URL.createObjectURL(new Blob([quiz.store.exportFile()], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    const text = t.savedTo(`${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}`, name);
    setSaved(text);
    try { localStorage.setItem(SAVED_KEY, text); } catch { /* the note is only a reminder */ }
  }

  async function load(file: File | undefined) {
    if (!file) return;
    const result = quiz.store.importFile(await file.text());
    if (!result.ok) return setNotice({ kind: 'refused', text: t.refused(result.message) });
    quiz.reload();
    const loaded = quiz.store.load();
    setNotice({ kind: 'loaded', text: t.loaded(answersIn(loaded.log), loaded.log[0] ? shortDate(loaded.savedAt || loaded.log[0].at) : '') });
  }

  function undo() {
    if (quiz.store.restoreBackup()) { quiz.reload(); setNotice({ kind: 'undone' }); }
  }

  return (
    <section className="card glass" aria-labelledby="sh">
      <a href={quizToHash({ sub: null })} className="iconbtn close" aria-label={t.close} onClick={(e) => { e.preventDefault(); onLeave(); }}>{X}</a>
      <div className="body">
        <div className="kicker">{t.kicker}</div>
        <h1 id="sh" ref={heading} tabIndex={-1}>{t.heading}</h1>
        <p className="lede">{t.lede}</p>
        {!quiz.persistent && <p className="note" role="status">{strings.quiz.storageBlocked}</p>}
        {newer !== null && <p className="note" role="status">{t.newer(newer)}</p>}
        <dl className="facts">
          <dt>{t.inBrowser}</dt><dd>{t.inBrowserValue(answers, first ? shortDate(first) : '', known)}</dd>
          <dt>{t.lastSaved}</dt><dd>{saved || t.neverSaved}</dd>
        </dl>
        <h2>{t.deviceHeading}</h2>
        <p className="note">{t.deviceNote}</p>
        {notice?.kind === 'loaded' && <p className="undo" role="status">{notice.text} <button className="linkbtn" onClick={undo}>{t.undo}</button></p>}
        {notice?.kind === 'undone' && <p className="undo" role="status">{t.undone}</p>}
        {notice?.kind === 'refused' && <p className="undo bad" role="alert">{notice.text}</p>}
      </div>
      <div className="foot">
        <button className="btn primary" onClick={save}>{t.save}</button>
        <button className="btn" disabled={newer !== null} onClick={() => picker.current?.click()}>{t.load}</button>
        <input
          ref={picker} type="file" accept=".json,application/json" hidden aria-label={t.loadLabel}
          onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; void load(f); }}
        />
      </div>
    </section>
  );
}
