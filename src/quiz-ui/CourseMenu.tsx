// "Learning for [course ▾]": the course filter over everything in Learn, a house-style button with a menu of the courses and their place counts.
import { useEffect, useId, useRef, useState } from 'react';
import { COURSES, courseOf, studySet, type Course } from '../quiz';
import { strings } from '../strings';
import type { Tree } from '../tree';

const c = strings.quiz.course;

export function CourseMenu({ tree, course, onChoose }: { tree: Tree; course: Course; onChoose(id: Course): void }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const menuId = useId();
  // Escape or a click outside closes the menu; the keyboard goes back to the button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    const onDown = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open]);
  const choose = (id: Course) => { onChoose(id); setOpen(false); button.current?.focus(); };
  return (
    <div className="for" ref={box}>
      <span className="for-label">{c.learningFor}</span>
      <button ref={button} type="button" className="for-btn" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(!open)}>
        {courseOf(course).label}<span className="caret" aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul id={menuId} className="course-menu" aria-label={c.menuLabel}>
          {COURSES.map((x) => (
            <li key={x.id}>
              <button type="button" aria-pressed={x.id === course} onClick={() => choose(x.id)}>
                <span>{x.label}</span><small>{c.places(studySet(tree, x.id).length)}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
