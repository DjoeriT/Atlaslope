import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import places from '../../data/places.json';
import { PlaceCard, RegionCard, SpainCard } from '../cards/Cards';
import { focusFor, validSelection } from '../cards/nav';
import { MapView } from '../map/MapView';
import { loadTree } from '../tree';
import { parseSelection, parseView, selectionToHash, type Selection, type View } from '../url';
import { FirstRun } from './FirstRun';
import { TopBar } from './TopBar';
import { useTheme } from './theme';

const here = () => location.pathname + location.search;

export function App() {
  const [theme, toggleTheme] = useTheme();
  const tree = useMemo(() => loadTree(places), []);
  const [sel, setSel] = useState<Selection>(() => validSelection(tree, parseSelection(location.hash)));
  const selRef = useRef(sel);
  selRef.current = sel;
  const restored = useRef(parseView(location.hash)); // only the first card keeps the camera from the link

  // A new card is a new history entry; back and forward come back as popstate.
  const go = useCallback((to: Selection) => {
    if (to.kind === selRef.current.kind && to.id === selRef.current.id) return;
    history.pushState(null, '', here() + selectionToHash(to));
    setSel(to);
  }, []);
  useEffect(() => {
    const onPop = () => setSel(validSelection(tree, parseSelection(location.hash)));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [tree]);

  // Where the map looks goes into the address bar without a new history entry.
  const onView = useCallback((view: View) => {
    history.replaceState(history.state, '', here() + selectionToHash(selRef.current, view));
  }, []);

  const focus = useMemo(() => focusFor(tree, sel), [tree, sel]);
  const place = sel.kind === 'place' ? tree.getPlace(sel.id) : undefined;
  const region = sel.kind === 'region' ? tree.getRegion(sel.id) : undefined;
  return (
    <>
      <MapView focus={focus} restored={restored.current} onPick={(id) => go({ kind: 'place', id })} onView={onView} />
      <TopBar theme={theme} onToggleTheme={toggleTheme} tree={tree} onOpen={go} />
      {place ? <PlaceCard tree={tree} go={go} place={place} /> : region ? <RegionCard tree={tree} go={go} region={region} /> : <SpainCard tree={tree} go={go} />}
      <FirstRun />
    </>
  );
}
