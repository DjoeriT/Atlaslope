import { defineConfig } from 'vite';
import { fillStoryCount, fillStoryList, storyCount, storyRows } from './src/home/storyList';
import { fillGuideCount, fillGuideList, guideRows, placeGuideCount } from './src/home/guideCount';

// GitHub Pages serves the site under /Atlaslope/ (the repo name) until atlaslope.com is pointed at it. A relative base works at any subpath and in any case,
// so dev, tests and the published site all use the same build.
// Debug-only query flags (src/debug.ts) exist only in dev and in the UI-test build (`--mode uitest`); the production build compiles them out.
export default defineConfig(({ mode }) => ({
  base: './',
  // Two pages (website slice 2): the home page at the root, the atlas at atlas/. Each is a real file, as GitHub Pages needs.
  build: { rollupOptions: { input: { home: 'index.html', atlas: 'atlas/index.html', guides: 'guides/index.html', stories: 'read-with-the-map/index.html', about: 'about/index.html' } } },
  plugins: [{ name: 'guide-count', transformIndexHtml: (html, ctx) => {
    // Every page that shows the guide count gets it; the Guides and Read with the map pages get their lists.
    const out = fillStoryCount(fillGuideCount(html, placeGuideCount()), storyCount());
    const file = ctx.filename.replace(/\\/g, '/');
    if (file.endsWith('read-with-the-map/index.html')) return fillStoryList(out, storyRows());
    return file.endsWith('guides/index.html') ? fillGuideList(out, guideRows()) : out;
  } }],
  esbuild: { jsx: 'automatic' },
  define: { __DEBUG_FLAGS__: JSON.stringify(mode === 'development' || mode === 'uitest') },
  test: { include: ['tests/unit/**/*.test.ts'] },
}));
