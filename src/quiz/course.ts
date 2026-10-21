// The learner's course ("My course" on the Study screen): which places Study asks. One setting over one memory per place (owner, 21 Oct 2026).
import curriculumFile from '../../content/curriculum.json' with { type: 'json' };
import type { Place } from '../tree';

/** No course (the default): every Study place. WSET levels: the places each published specification names. Wine Scholar: every core place. */
export const COURSES = ['none', 'wset-2', 'wset-3', 'wine-scholar'] as const;
export type Course = (typeof COURSES)[number];

export const isCourse = (x: unknown): x is Course => COURSES.includes(x as Course);

const wset = (curriculumFile as { wset: { levels: Record<string, string[]> } }).wset.levels;

/** Whether a course asks this place. Only places Study asks at all reach here (core places and zones). */
export function inCourse(course: Course, place: Place): boolean {
  if (course === 'wset-2') return wset['2'].includes(place.id);
  if (course === 'wset-3') return wset['3'].includes(place.id);
  if (course === 'wine-scholar') return place.quiz === 'core';
  return true;
}
