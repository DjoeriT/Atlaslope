// The satellite still in the guide's map tour band (B3, owner 21 Oct 2026): the tour's first stop on the app's own map, not
// interactive, its camera drifting a few degrees and back over about a minute. Still under reduced motion and while off screen.
// Lazy, in the tour chunk; MapLibre itself is already loaded by the atlas under the page.
import { useEffect, useRef } from 'react';
import { createMap } from '../map/createMap';
import { DEFAULT_MENU } from '../map/layers';
import type { Story } from './format';

export function TourStill({ story }: { story: Story }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // The first stop with a fixed camera (the opening view when none has one).
    const cam = story.steps.slice(1).find((s) => s.camera.center)?.camera ?? story.steps[0].camera;
    const [lng, lat] = cam.center ?? [-3.7, 40.4];
    const base = { lng, lat, zoom: cam.zoom ?? 8, bearing: cam.bearing ?? 0, pitch: cam.pitch ?? 0 };
    const ctl = createMap(el.current as HTMLDivElement, { ...DEFAULT_MENU, boundaries: false }, { onImageryFailed: () => {} }, base);
    const m = ctl.map;
    // Decoration: out of the tab order and away from screen readers (the wrapper is inert and aria-hidden).
    m.getCanvas().tabIndex = -1;
    m.getCanvasContainer().tabIndex = -1;
    for (const h of [m.dragPan, m.scrollZoom, m.boxZoom, m.dragRotate, m.keyboard, m.doubleClickZoom, m.touchZoomRotate, m.touchPitch]) h.disable();

    let raf = 0, seen = false;
    const t0 = performance.now();
    const drift = (t: number) => {
      m.jumpTo({ bearing: base.bearing + 16 * Math.sin((t - t0) / 9000), center: [base.lng + 0.05 * Math.sin((t - t0) / 13000), base.lat] });
      raf = seen ? requestAnimationFrame(drift) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      seen = e.isIntersecting;
      if (seen && !raf && !matchMedia('(prefers-reduced-motion: reduce)').matches) raf = requestAnimationFrame(drift);
    });
    m.once('load', () => io.observe(el.current as HTMLDivElement));
    return () => { io.disconnect(); cancelAnimationFrame(raf); ctl.remove(); };
  }, [story]);
  return <div className="pg-tour-still" ref={el} aria-hidden="true" {...{ inert: '' }} />;
}
