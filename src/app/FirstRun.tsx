import { useEffect, useRef, useState } from 'react';
import { strings } from '../strings';

const KEY = 'atlaslope-first-run';
const t = strings.firstRun;

function alreadySeen(): boolean {
  try { return localStorage.getItem(KEY) === 'seen'; } catch { return false; }
}

/** Shown once per browser; "Start exploring" remembers that it was seen. */
export function FirstRun() {
  const [visible, setVisible] = useState(() => !alreadySeen());
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (visible) buttonRef.current?.focus(); }, [visible]);
  if (!visible) return null;

  const dismiss = () => {
    try { localStorage.setItem(KEY, 'seen'); } catch { /* storage blocked: it shows again next visit */ }
    setVisible(false);
  };

  return (
    <section className="card glass first" role="dialog" aria-label={t.label}>
      <div className="body">
        <div className="kicker">{t.kicker}</div>
        <h1>{strings.appName}</h1>
        <p className="lede">{t.lede}</p>
        <h3>{t.hintsTitle}</h3>
        <ul className="hints">
          {t.hints.map((parts) => (
            <li key={parts[0]}>
              {parts.map((text, i) => (i % 2 === 0 ? <b key={i}>{text}</b> : text))}
            </li>
          ))}
        </ul>
      </div>
      <div className="foot">
        <button ref={buttonRef} className="btn primary" onClick={dismiss}>{t.start}</button>
      </div>
    </section>
  );
}
