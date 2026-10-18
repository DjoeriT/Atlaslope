import type { Photo } from '../facts/types';

// One photo credit, the same everywhere, its parts split by a dot, not commas (owner, 18 Oct 2026: "What's with the commas"): the author linked to the Commons page, the licence linked to its text, and "resized" for
// CC BY and CC BY-SA files, whose licences ask for any change to be indicated (we ship smaller WebP copies; owner card, 18 Oct 2026).
const RESIZED = 'resized';
const changed = (licence: string) => /^CC BY\b/.test(licence);

export function Credit({ photo }: { photo: Photo }) {
  const link = { target: '_blank', rel: 'noopener noreferrer' } as const;
  return (
    <>
      <a href={photo.page} {...link}>{photo.artist}</a>{' · '}
      {photo.licenceUrl ? <a href={photo.licenceUrl} {...link}>{photo.licence}</a> : photo.licence}
      {changed(photo.licence) && ` · ${RESIZED}`}
    </>
  );
}

