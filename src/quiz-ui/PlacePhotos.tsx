// Places in Learn as photos with their names only (owner, 21 Oct 2026). Each photo is the place's first, cropped square around the focus
// checked for the Guides page (src/home/photoCrops.json; a unit test fails while a place Learn can show has no checked crop).
import { Fragment } from 'react';
import photoCropsFile from '../home/photoCrops.json';
import { Credit, oneEach } from '../cards/Credit';
import { photosOf } from '../facts';
import { strings } from '../strings';
import type { Tree } from '../tree';

const crops = photoCropsFile as Record<string, { focus: string }>;

const shown = (tree: Tree, ids: readonly string[]) =>
  ids.flatMap((id) => {
    const place = tree.getPlace(id);
    return place ? [{ id, name: place.name.split(' / ')[0], photo: photosOf(id)[0] }] : [];
  });

export function PlacePhotos({ tree, ids, label }: { tree: Tree; ids: readonly string[]; label: string }) {
  if (!ids.length) return null;
  return (
    <ul className="learn-photos" aria-label={label}>
      {shown(tree, ids).map(({ id, name, photo }) => (
        <li key={id}>
          {photo
            ? <img src={photo.src} srcSet={photo.srcSet} sizes="80px" alt="" loading="lazy" style={{ objectPosition: crops[`${id}-1`]?.focus }} />
            : <span className="nophoto" aria-hidden="true" />}
          <span>{name}</span>
        </li>
      ))}
    </ul>
  );
}

/** One always-visible credit line for the photos shown: "Photos: Name · licence · cropped and resized", one entry per author and licence. */
export function PhotoCredit({ tree, ids }: { tree: Tree; ids: readonly string[] }) {
  const photos = oneEach(shown(tree, ids).flatMap((s) => (s.photo ? [s.photo] : [])));
  if (!photos.length) return null;
  return (
    <p className="credit">
      {strings.quiz.photosCredit}{' '}
      {photos.map((p, i) => <Fragment key={p.src}>{i > 0 && '; '}<Credit photo={p} /></Fragment>)}
    </p>
  );
}
