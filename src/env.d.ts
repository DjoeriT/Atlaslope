/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_ESRI_API_KEY?: string; // close-in imagery key, set at build time (.env.example)
}
declare module 'virtual:search-index' {
  const index: import('./home/plainSearch').SearchIndex;
  export default index;
}
declare module 'virtual:outlines' {
  /** Country id to its outlines file's URL and each outline's box (vite.config.ts, src/map/outlines.ts). */
  const files: Record<string, import('./map/outlines').OutlineFile>;
  export default files;
}
declare module 'virtual:photo-data' {
  const data: { photos: Record<string, import('./facts/types').Photo>; sizes: { sizes: number[]; photos: Record<string, { w: number; h: number; blur: string }> } };
  export default data;
}
