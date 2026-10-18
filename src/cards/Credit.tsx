import type { Photo } from '../facts/types';

// One photo credit, the same everywhere: the author linked to the Commons page, the licence linked to its text, and "resized" for
// CC BY and CC BY-SA files, whose licences ask for any change to be indicated (we ship smaller WebP copies; owner card, 18 Oct 2026).
const RESIZED = 'resized';
const changed = (licence: string) => /^CC BY\b/.test(licence);

export function Credit({ photo }: { photo: Photo }) {
  const link = { target: '_blank', rel: 'noopener noreferrer' } as const;
  return (
    <>
      <a href={photo.page} {...link}>{photo.artist}</a>,{' '}
      {photo.licenceUrl ? <a href={photo.licenceUrl} {...link}>{photo.licence}</a> : photo.licence}
      {changed(photo.licence) && `, ${RESIZED}`}
    </>
  );
}

/** The credit on a photo (owner point 4, 18 Oct 2026: "way smaller", "of all images"): a small © tag in the corner that opens to the full
 * credit on hover, keyboard focus or a tap, so the photo stays clean and the author and licence stay one step away. */
export function CreditTag({ photo }: { photo: Photo }) {
  return (
    <span className="ctag">
      <button type="button" className="ctag-i" aria-label={`Photo: ${photo.artist}, ${photo.licence}`} title={`Photo: ${photo.artist}, ${photo.licence}`}>©</button>
      <span className="ctag-full"><Credit photo={photo} /></span>
    </span>
  );
}
