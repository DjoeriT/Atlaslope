// The learner's course ("Learning for" in Learn): which places Learn asks, in rounds and in practice. One setting over one memory per
// place (owner, 21 Oct 2026). The courses are data: content/curriculum.json "courses", one entry per course and country.
import curriculumFile from '../../content/curriculum.json' with { type: 'json' };
import type { Place } from '../tree';

export interface CourseInfo {
  /** e.g. "wset-3-es"; the stored setting. */
  id: string;
  provider: string | null;
  name: string;
  /** Country code, e.g. "es". */
  country: string;
  /** What the visitor sees, e.g. "WSET Level 3 · Spain". */
  label: string;
  /** The honest scope line: what we have on file for this course. */
  onFile: string;
  source: { title: string; url: string | null; date: string | null } | null;
  /** all: every place Learn asks; core: every core place; wset: the places its level's specification names. */
  rule: 'all' | 'core' | 'wset';
  level?: string;
}

export type Course = string;

const file = curriculumFile as unknown as { wset: { levels: Record<string, string[]> }; courses: CourseInfo[] };

/** Every course in menu order; the first is the no-course entry ("All of Spain"). */
export const COURSES: readonly CourseInfo[] = file.courses;
/** No course (the default): "All of Spain". */
export const NO_COURSE: Course = COURSES[0].id;

// Ids stored before the courses list (Study step 1, 21 Oct 2026) keep loading.
const OLD_IDS: Record<string, Course> = { none: 'all-es', 'wset-2': 'wset-2-es', 'wset-3': 'wset-3-es', 'wine-scholar': 'wine-scholar-es' };

export const isCourse = (x: unknown): x is Course => COURSES.some((c) => c.id === x);

/** A stored setting as a course: old ids mapped, anything unknown read as no course. */
export function readCourse(x: unknown): Course {
  const id = typeof x === 'string' ? OLD_IDS[x] ?? x : '';
  return isCourse(id) ? id : NO_COURSE;
}

export const courseOf = (id: Course): CourseInfo => COURSES.find((c) => c.id === id) ?? COURSES[0];

/** Whether a course asks this place. Only places Learn asks at all reach here (core places and zones). */
export function inCourse(course: Course, place: Place): boolean {
  const c = courseOf(course);
  if (c.rule === 'wset') return (file.wset.levels[c.level ?? ''] ?? []).includes(place.id);
  if (c.rule === 'core') return place.quiz === 'core';
  return true;
}
