/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_ESRI_API_KEY?: string; // close-in imagery key, set at build time (.env.example)
}
declare module 'virtual:search-index' {
  const index: import('./home/plainSearch').SearchIndex;
  export default index;
}
