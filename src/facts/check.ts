import type { Place } from '../tree';
import { STYLE_KINDS, type Cite, type SheetFile, type Sources } from './types';

const MAX_WHY_WORDS = 25;
const CITE = /^([a-z0-9-]+)(?::(p\d+))?$/;
const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

/** Every problem in the fact sheets, in plain English. An empty list means the sheets pass. */
export function checkSheets(files: SheetFile[], places: Place[], sources: Sources): string[] {
  const errors: string[] = [];
  const placeById = new Map(places.map((p) => [p.id, p]));
  const seen = new Set<string>();

  const checkCites = (where: string, cites: Cite[], hasContent: boolean) => {
    if (hasContent && cites.length === 0) errors.push(`${where} has no source.`);
    for (const c of cites) {
      const m = CITE.exec(c);
      if (!m) { errors.push(`${where}: source "${c}" is not "<source id>" or "<source id>:p<number>".`); continue; }
      if (!(m[1] in sources)) errors.push(`${where}: source "${m[1]}" is not in content/sources.json.`);
    }
  };

  for (const file of files) {
    for (const sheet of file.sheets) {
      const at = (row: string) => `${sheet.id}, ${row}`;
      const place = placeById.get(sheet.id);
      if (!place) errors.push(`${file.region}: "${sheet.id}" is not a place.`);
      else if (place.quiz === 'none') errors.push(`${file.region}: ${sheet.id} is not quizzed, so it has no sheet.`);
      else if (place.region !== file.region) errors.push(`${sheet.id} is in the study region ${place.region} but its sheet is in the ${file.region} file.`);
      if (seen.has(sheet.id)) errors.push(`${sheet.id} has more than one sheet.`);
      seen.add(sheet.id);

      const why = sheet.why.text.trim();
      if (!why) errors.push(at('the why line') + ' is empty.');
      else if (words(why) > MAX_WHY_WORDS) errors.push(at('the why line') + ` is ${words(why)} words; the limit is ${MAX_WHY_WORDS}.`);
      checkCites(at('the why line'), sheet.why.cite, why !== '');

      checkCites(at('main grapes'), sheet.grapes.cite, sheet.grapes.main.length > 0);
      checkCites(at('other grapes'), sheet.grapes.othersCite, sheet.grapes.others.length > 0);
      for (const kind of sheet.styles.kinds) {
        if (!(STYLE_KINDS as readonly string[]).includes(kind)) errors.push(at('styles') + `: "${kind}" is not a style kind.`);
      }
      checkCites(at('styles'), sheet.styles.cite, sheet.styles.text.trim() !== '' || sheet.styles.kinds.length > 0);
      checkCites(at('climate'), sheet.climate.cite, sheet.climate.text.trim() !== '');
      checkCites(at('soil'), sheet.soil.cite, sheet.soil.text.trim() !== '');
      if (sheet.altitude) checkCites(at('altitude'), sheet.altitude.cite, sheet.altitude.text.trim() !== '');
    }

    // A region file is all or nothing: a sheet for every quizzed place of the region, or no sheets.
    const have = new Set(file.sheets.map((s) => s.id));
    const missing = places.filter((p) => p.region === file.region && p.quiz !== 'none' && !have.has(p.id));
    if (have.size > 0 && missing.length > 0) {
      errors.push(`${file.region} has sheets for some places but not for ${missing.map((p) => p.id).join(', ')}.`);
    }
  }
  return errors;
}
