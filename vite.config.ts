import { defineConfig } from 'vite';

// GitHub Pages serves the site under /Atlaslope/ (the repo name) until atlaslope.com is pointed at it. A relative base works at any subpath and in any case,
// so dev, tests and the published site all use the same build.
// Debug-only query flags (src/debug.ts) exist only in dev and in the UI-test build (`--mode uitest`); the production build compiles them out.
export default defineConfig(({ mode }) => ({
  base: './',
  esbuild: { jsx: 'automatic' },
  define: { __DEBUG_FLAGS__: JSON.stringify(mode === 'development' || mode === 'uitest') },
  test: { include: ['tests/unit/**/*.test.ts'] },
}));
