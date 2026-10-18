import type { Photo } from '../facts/types';

// One photo credit, the same everywhere, its parts split by a dot, not commas (owner, 18 Oct 2026: "What's with the commas"): the author linked to the Commons page, the licence linked to its text, and "resized" for
// CC BY and CC BY-SA files, whose licences ask for any change to be indicated (we ship smaller WebP copies; owner card, 18 Oct 2026).
const RESIZED = 'resized';
const changed = (licence: string) => /^CC BY\b/.test(licence);
// Commons names no author for a few files: CC asks for the creator only when one is supplied, so the credit names where the photo is from.
const byline = (artist: string) => (/^unknown\b/i.test(artist) ? 'Wikimedia Commons' : artist);

export function Credit({ photo }: { photo: Photo }) {
  const link = { target: '_blank', rel: 'noopener noreferrer' } as const;
  return (
    <>
      <a href={photo.page} {...link}>{byline(photo.artist)}</a>{' · '}
      {photo.licenceUrl ? <a href={photo.licenceUrl} {...link}>{photo.licence}</a> : photo.licence}
      {changed(photo.licence) && ` · ${RESIZED}`}
    </>
  );
}


/** A credit line's photos, one entry per author and licence: two photos by Juanedc read once, not "Juanedc …; Juanedc …" (premium feel
 *  review, 18 Oct 2026). The full-screen view still credits each photo with its own file page. */
export function oneEach<P extends Photo>(photos: readonly P[]): P[] {
  const seen = new Set<string>();
  return photos.filter((p) => {
    const key = `${byline(p.artist)}|${p.licence}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const creditName = byline;
