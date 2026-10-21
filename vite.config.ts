import { defineConfig } from 'vite';
import { fillStoryCount, fillStoryList, storyCount, storyRows } from './src/home/storyList';
import { fillGuideCount, fillGuideList, guideRows, placeGuideCount } from './src/home/guideCount';

// GitHub Pages serves the site under /Atlaslope/ (the repo name) until atlaslope.com is pointed at it. A relative base works at any subpath and in any case,
// so dev, tests and the published site all use the same build.
// Debug-only query flags (src/debug.ts) exist only in dev and in the UI-test build (`--mode uitest`); the production build compiles them out.
export default defineConfig(({ mode }) => ({
  base: './',
  // Two pages (website slice 2): the home page at the root, the atlas at atlas/. Each is a real file, as GitHub Pages needs.
  // Everything a map tour loads goes under dist/story/, so Tools/check.sh can count it apart from the main site (own limit, owner 21 Oct 2026).
  build: { rollupOptions: {
    input: { home: 'index.html', atlas: 'atlas/index.html', guides: 'guides/index.html', stories: 'map-tours/index.html', about: 'about/index.html' },
    output: {
      chunkFileNames: (c) => (!c.isEntry && c.moduleIds.some((m) => /\/(src\/story|content\/stories|data\/story)\//.test(m)) ? 'story/[name]-[hash].js' : 'assets/[name]-[hash].js'),
      assetFileNames: (a) => ((a.originalFileNames ?? []).some((n) => n.startsWith('data/story/')) ? 'story/[name]-[hash][extname]' : 'assets/[name]-[hash][extname]'),
    },
  } },
  plugins: [{ name: 'guide-count', transformIndexHtml: (html, ctx) => {
    // Every page that shows the guide count gets it; the Guides and Map tours pages get their lists.
    const out = fillStoryCount(fillGuideCount(html, placeGuideCount()), storyCount());
    const file = ctx.filename.replace(/\\/g, '/');
    if (file.endsWith('map-tours/index.html')) return fillStoryList(out, storyRows());
    return file.endsWith('guides/index.html') ? fillGuideList(out, guideRows()) : out;
  } }],
  esbuild: { jsx: 'automatic' },
  define: { __DEBUG_FLAGS__: JSON.stringify(mode === 'development' || mode === 'uitest') },
  test: { include: ['tests/unit/**/*.test.ts'] },
}));
