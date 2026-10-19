import { readdirSync } from 'node:fs';

// The home page says how many places have a guide. It is plain HTML, so the number is filled in at build time from content/guides/
// (one JSON file per place), and new guides change it without touching the page (handoff 2026-10-19-home-refresh-build.md).
export const guideCount = (dir = 'content/guides'): number => readdirSync(dir).filter((f) => f.endsWith('.json')).length;

export const fillGuideCount = (html: string, n: number): string => html.replace(/(data-count="guides">)\d+(<)/g, `$1${n}$2`);
