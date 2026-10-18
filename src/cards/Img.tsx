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

/** A shipped photo (polish pack, 18 Oct 2026): the right file for its slot, a blurred preview at once, and the photo sharpening in when
 * it arrives. A photo that is already in the cache shows straight away, with no fade. */
export function Img({ photo, sizes, alt = photo.alt, lazy, onError }: Props) {
  const [state, setState] = useState<'wait' | 'fade' | 'done'>('wait');
  const seen = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) setState('done');
  }, []);
  const style = photo.blur && state !== 'done' ? ({ backgroundImage: blurImage(photo.blur) } as CSSProperties) : undefined;
  return (
    <img
      ref={seen}
      className={`ph-${state}`}
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={photo.srcSet ? sizes : undefined}
      alt={alt}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      style={style}
      onLoad={() => setState((s) => (s === 'wait' ? 'fade' : s))}
      onError={onError}
    />
  );
}
