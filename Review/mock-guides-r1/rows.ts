// Runs the app's own guideRows() (the function that renders the Guides page at build time) and prints its result as JSON.
// Run from the repo root: npx vite-node Review/mock-guides-r1/rows.ts
import { guideRows, photoCrops } from '../../src/home/guideCount';

const list = guideRows();
console.log(JSON.stringify({
  regions: list.regions,
  photos: list.photos,
  crops: Object.fromEntries(list.rows.filter((r) => r.photo).map((r) => [r.photo, photoCrops[r.photo!]?.focus ?? '50% 50%'])),
  featured: list.featured ? { id: list.featured.row.id, facts: list.featured.facts } : null,
}));
