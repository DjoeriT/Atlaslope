// How the open card, the breadcrumb and the map fit together. Pure: no React, no map.
import type { Crumb, NodeKind, Tree } from '../tree';
import type { Focus } from '../map/focus';
import { flyTargetOf, guideOf, type FlyTarget } from '../facts/guides';
import { ATLAS, ATLAS_ID, SPAIN, isAtlas, type Selection } from '../url';
import { liveBounds } from './atlasCover';

/** Which kind of node a crumb or search hit is, from the country's own level names (country, region, place, zone, ...). */
export function selectionOf(tree: Tree, crumb: Crumb): Selection {
  if (crumb.id === ATLAS_ID) return ATLAS; // the "Atlas" step a country card puts above its title
  const levels = tree.countries.find((c) => c.levels.includes(crumb.level))?.levels ?? tree.countries[0]?.levels ?? [];
  const depth = levels.indexOf(crumb.level);
  const kind: NodeKind = depth === 0 ? 'country' : depth === 1 ? 'region' : 'place';
  return { kind, id: crumb.id };
}

/** The selection a hash named, or Spain when the id is not in the tree. The atlas cover and a country the tree holds stay as they are. */
export function validSelection(tree: Tree, sel: Selection): Selection {
  if (sel.kind === 'region') {
    if (!tree.getRegion(sel.id)) return SPAIN;
    const sole = tree.soleSameName(sel.id); // a region that holds only its namesake (Rioja) opens the place itself
    return sole ? { kind: 'place', id: sole.id, ...(sel.page ? { page: true } : {}) } : sel;
  }
  if (sel.kind === 'place') {
    if (!tree.getPlace(sel.id)) return SPAIN;
    if (!sel.fly || flyOf(sel)) return sel;
    const { fly: _dropped, ...plain } = sel; // a fly-there the guide does not have is just the place
    return plain;
  }
  return isAtlas(sel) || tree.countries.some((c) => c.id === sel.id) ? sel : SPAIN;
}

/** The fly-there a selection names (#place=rioja&fly=valley.1), or undefined when it names none or the guide has no such pill. */
export function flyOf(sel: Selection): FlyTarget | undefined {
  if (sel.kind !== 'place' || !sel.fly) return undefined;
  const guide = guideOf(sel.id);
  return guide ? flyTargetOf(guide, sel.fly.chapter, sel.fly.index) : undefined;
}

/** The step above a selection: Spain from a region, the region from a top place, the place from a zone. */
export function parentOf(tree: Tree, sel: Selection): Selection {
  const trail = tree.breadcrumb(sel.id, sel.kind);
  const up = trail[trail.length - 2];
  return up ? selectionOf(tree, up) : SPAIN;
}

/** What the map shows for a card: Spain whole; a region framed with the rest dimmed; a place or zone framed and highlighted. */
export function focusFor(tree: Tree, sel: Selection): Focus {
  const fly = flyOf(sel);
  if (fly) {
    if (fly.place) return focusFor(tree, { kind: 'place', id: fly.place });
    if (fly.point && fly.zoom) return { ...focusFor(tree, { kind: 'place', id: sel.id }), frame: { point: fly.point, zoom: fly.zoom }, pin: fly.label };
  }
  if (sel.kind === 'region') return { frame: { region: sel.id }, dimRegion: sel.id, select: null, showZones: false };
  const place = sel.kind === 'place' ? tree.getPlace(sel.id) : undefined;
  if (isAtlas(sel)) return { frame: null, bounds: liveBounds(tree), dimRegion: null, select: null, showZones: false }; // every live country in view
  if (!place) return { frame: null, country: sel.kind === 'country' ? sel.id : undefined, dimRegion: null, select: null, showZones: false };
  const isZone = tree.levelName(place) === 'zone';
  const hasZones = tree.children(place.id, 'place').length > 0;
  return {
    frame: isZone ? { zone: place.id } : { place: place.id },
    dimRegion: null,
    select: place.id,
    showZones: isZone || hasZones,
  };
}
