// Real place pages (decision #48): /pt/douro/ is a file the build writes, holding the atlas with a <base> back to atlas/. The path names
// the place and its page; the hash keeps the rest (view, story, at). Every other address stays atlas/#place=... as before.
import { countryConfig, PATH_CODES } from './countries';
import type { Tree } from './tree';
import type { Selection } from './url';

const PLACE_PATH = /\/([a-z]{2})\/([a-z0-9]+(?:-[a-z0-9]+)*)\/(?:index\.html)?$/;

/** The place a real place path names, or null. */
export function placeOfPath(pathname: string): { code: string; id: string } | null {
  const m = PLACE_PATH.exec(pathname);
  return m && PATH_CODES[m[1]] ? { code: m[1], id: m[2] } : null;
}

/** The hash as the app reads it: on a place path, the path's place and page come first unless the hash names a card itself. */
export function hashAt(pathname: string, hash: string): string {
  const at = placeOfPath(pathname);
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  if (!at || p.has('place') || p.has('region') || p.has('study')) return hash;
  const rest = hash.replace(/^#/, '');
  return `#place=${at.id}&page${rest ? `&${rest}` : ''}`;
}

/** The real path of a selection's page, relative to the site root ("pt/douro/"), or null when it has none. */
export function pathOf(tree: Tree, sel: Selection | null): string | null {
  if (!sel || sel.kind !== 'place' || !sel.page) return null;
  const country = tree.countryOf(sel.id);
  const cfg = country ? countryConfig(country.id) : null;
  return cfg?.paths ? `${cfg.code}/${sel.id}/` : null;
}

/** The site root as a path ("/" or "/Atlaslope/"): atlas/ and a place path's <base> both sit one level below it. */
export const siteRoot = (base: string = document.baseURI): string => new URL('../', base).pathname;

/** The address for a selection (null: no card, as for Study) with the hash the app wrote for it. */
export function addressOf(tree: Tree, sel: Selection | null, hash: string, here: Location = location): string {
  const path = pathOf(tree, sel);
  if (path) {
    const p = new URLSearchParams(hash.replace(/^#/, ''));
    p.delete('place');
    p.delete('page');
    const rest = p.toString().replace(/%2C/g, ',').replace(/(^|&)(story)=(?=&|$)/g, '$1$2');
    return siteRoot() + path + here.search + (rest ? `#${rest}` : '');
  }
  const pathname = placeOfPath(here.pathname) ? `${siteRoot()}atlas/` : here.pathname;
  return pathname + here.search + hash;
}

/** Every place with a real page, as its country code and id. */
export const placePaths = (tree: Tree): Array<{ code: string; id: string }> =>
  tree.places.flatMap((p) => {
    const path = pathOf(tree, { kind: 'place', id: p.id, page: true });
    return path ? [{ code: path.slice(0, 2), id: p.id }] : [];
  });

/** A place's page file: the built atlas page with a <base> back to atlas/ (two levels up), so its relative links and assets still hold. */
export function placePage(atlasHtml: string, code: string, id: string): string {
  if (!/<head>/.test(atlasHtml)) throw new Error('placePage: the atlas page has no <head>');
  return atlasHtml
    .replace('<head>', '<head>\n    <base href="../../atlas/" />')
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1https://atlaslope.com/${code}/${id}/$2`);
}
