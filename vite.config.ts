import { defineConfig } from 'vite';
import { fillGuideCount, guideCount } from './src/home/guideCount';

// GitHub Pages serves the site under /Atlaslope/ (the repo name) until atlaslope.com is pointed at it. A relative base works at any subpath and in any case,
// so dev, tests and the published site all use the same build.
// Debug-only query flags (src/debug.ts) exist only in dev and in the UI-test build (`--mode uitest`); the production build compiles them out.
export default defineConfig(({ mode }) => ({
  base: './',
  // Two pages (website slice 2): the home page at the root, the atlas at atlas/. Each is a real file, as GitHub Pages needs.
  build: { rollupOptions: { input: { home: 'index.html', atlas: 'atlas/index.html', guides: 'guides/index.html', about: 'about/index.html' } } },
  plugins: [{ name: 'guide-count', transformIndexHtml: (html) => fillGuideCount(html, guideCount()) }],
  esbuild: { jsx: 'automatic' },
  define: { __DEBUG_FLAGS__: JSON.stringify(mode === 'development' || mode === 'uitest') },
  test: { include: ['tests/unit/**/*.test.ts'] },
}));
