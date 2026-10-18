import { useCallback, useState, type CSSProperties } from 'react';
import type { ShownPhoto } from '../facts';

/** The blur preview as a CSS image: the 16 px WebP drawn in an SVG with a blur that keeps the edges opaque. */
function blurImage(b64: string): string {
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 12'>" +
    "<filter id='b' color-interpolation-filters='sRGB'><feGaussianBlur stdDeviation='1.2'/>" +
    "<feComponentTransfer><feFuncA type='discrete' tableValues='1 1'/></feComponentTransfer></filter>" +
    `<image width='16' height='12' preserveAspectRatio='xMidYMid slice' filter='url(#b)' href='data:image/webp;base64,${b64}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

interface Props {
  photo: ShownPhoto;
  /** How wide the slot is, as the `sizes` attribute, so the browser picks the smallest file that is sharp there. */
  sizes: string;
  alt?: string;
  lazy?: boolean;
  onError?: () => void;
}

/** The file each photo last showed (its `currentSrc`), so the same photo in another slot can paint that cached file at once. */
const shown = new Map<string, string>();

/** A shipped photo (polish pack, 18 Oct 2026): the right file for its slot, a blurred preview at once, and the photo sharpening in when
 * it arrives. A photo already in the cache shows straight away. A photo shown before in another slot (the card cover that becomes the
 * page's hero in the view transition) paints that earlier file underneath while its own loads, with no blur or fade. */
export function Img({ photo, sizes, alt = photo.alt, lazy, onError }: Props) {
  const [state, setState] = useState<'wait' | 'fade' | 'done'>('wait');
  const before = shown.get(photo.src);
  const seen = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) setState('done');
  }, []);
  const layers = [before && `url("${before}")`, photo.blur && blurImage(photo.blur)].filter(Boolean).join(', ');
  const style = layers && state !== 'done' ? ({ backgroundImage: layers } as CSSProperties) : undefined;
  return (
    <img
      ref={seen}
      className={`ph-${state}`}
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={photo.srcSet ? sizes : undefined}
      alt={alt}
      // Hover shows what the photo is and whose it is (owner, 18 Oct 2026: "On-hover has no texts anywhere"); decorative thumbnails stay silent.
      title={alt ? `${alt} · ${photo.artist}, ${photo.licence}` : undefined}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      style={style}
      onLoad={(e) => {
        shown.set(photo.src, e.currentTarget.currentSrc);
        setState((s) => (s === 'wait' && !before ? 'fade' : 'done'));
      }}
      onAnimationEnd={(e) => { if (e.animationName === 'ph-in') setState('done'); }}
      onError={onError}
    />
  );
}
