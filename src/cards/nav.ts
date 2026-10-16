// How the open card, the breadcrumb and the map fit together. Pure: no React, no map.
import type { Crumb, NodeKind, Tree } from '../tree';
import type { Focus } from '../map/focus';
import { SPAIN, type Selection } from '../url';

/** Which kind of node a crumb or search hit is, from the country's own level names (country, region, place, zone, ...). */
export function selectionOf(tree: Tree, crumb: Crumb): Selection {
  const levels = tree.countries[0]?.levels ?? [];
  const depth = levels.indexOf(crumb.level);
  const kind: NodeKind = depth === 0 ? 'country' : depth === 1 ? 'region' : 'place';
  return { kind, id: crumb.id };
}

/** The selection a hash named, or Spain when the id is not in the tree. */
export function validSelection(tree: Tree, sel: Selection): Selection {
  if (sel.kind === 'region') return tree.getRegion(sel.id) ? sel : SPAIN;
  if (sel.kind === 'place') return tree.getPlace(sel.id) ? sel : SPAIN;
  return SPAIN;
}

/** The step above a selection: Spain from a region, the region from a top place, the place from a zone. */
export function parentOf(tree: Tree, sel: Selection): Selection {
  const trail = tree.breadcrumb(sel.id, sel.kind);
  const up = trail[trail.length - 2];
  return up ? selectionOf(tree, up) : SPAIN;
}

/** What the map shows for a card: Spain whole; a region framed with the rest dimmed; a place or zone framed and highlighted. */
export function focusFor(tree: Tree, sel: Selection): Focus {
  if (sel.kind === 'region') return { frame: { region: sel.id }, dimRegion: sel.id, select: null, showZones: false };
  const place = sel.kind === 'place' ? tree.getPlace(sel.id) : undefined;
  if (!place) return { frame: null, dimRegion: null, select: null, showZones: false };
  const isZone = tree.levelName(place) === 'zone';
  const hasZones = tree.children(place.id, 'place').length > 0;
  return {
    frame: isZone ? { zone: place.id } : { place: place.id },
    dimRegion: null,
    select: place.id,
    showZones: isZone || hasZones,
  };
}
