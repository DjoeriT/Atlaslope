import { defineConfig } from 'vite';
import { searchIndex } from './src/home/searchIndex';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { loadTree } from './src/tree';
import { placeOfPath, placePage, placePaths } from './src/paths';
import { fillGuideCount, fillGuideList, fillStoryCount, guideRows, placeGuideCount, storyCount } from './src/home/guideCount';

// GitHub Pages serves the site under /Atlaslope/ (the repo name) until atlaslope.com is pointed at it. A relative base works at any subpath and in any case,
// so dev, tests and the published site all use the same build.
// Debug-only query flags (src/debug.ts) exist only in dev and in the UI-test build (`--mode uitest`); the production build compiles them out.
let outDir = 'dist';

export default defineConfig(({ mode }) => ({
  base: './',
  // Two pages (website slice 2): the home page at the root, the atlas at atlas/. Each is a real file, as GitHub Pages needs.
  // Everything a map tour loads goes under dist/story/, so Tools/check.sh can count it apart from the main site (own limit, owner 21 Oct 2026).
  build: { rollupOptions: {
    input: { home: 'index.html', atlas: 'atlas/index.html', guides: 'guides/index.html', about: 'about/index.html' },
    output: {
      chunkFileNames: (c) => (!c.isEntry && c.moduleIds.some((m) => /\/(src\/story|content\/stories|data\/story)\//.test(m)) ? 'story/[name]-[hash].js' : 'assets/[name]-[hash].js'),
      assetFileNames: (a) => ((a.originalFileNames ?? []).some((n) => n.startsWith('data/story/')) ? 'story/[name]-[hash][extname]' : 'assets/[name]-[hash][extname]'),
    },
  } },
  plugins: [{
    // The plain pages' search index, loaded on first focus (src/home/search.ts): names and ids only, a chunk of its own.
    name: 'search-index',
    resolveId: (id) => (id === 'virtual:search-index' ? '\0virtual:search-index' : undefined),
    load: (id) => (id === '\0virtual:search-index' ? `export default ${JSON.stringify(searchIndex())};` : undefined),
  }, { name: 'guide-count', transformIndexHtml: (html, ctx) => {
    // Every page that shows the guide count gets it; the Guides page gets its list.
    const out = fillStoryCount(fillGuideCount(html, placeGuideCount()), storyCount());
    const file = ctx.filename.replace(/\\/g, '/');
    return file.endsWith('guides/index.html') ? fillGuideList(out, guideRows()) : out;
  } }, {
    // Real place pages (decision #48): the built atlas page again at <code>/<place>/ (pt/douro/), one file each, as GitHub Pages needs.
    name: 'place-paths',
    configResolved(config) { outDir = config.build.outDir; },
    writeBundle() {
      const atlas = readFileSync(`${outDir}/atlas/index.html`, 'utf8');
      const tree = loadTree(JSON.parse(readFileSync('data/places.json', 'utf8')));
      for (const { code, id } of placePaths(tree)) {
        mkdirSync(`${outDir}/${code}/${id}`, { recursive: true });
        writeFileSync(`${outDir}/${code}/${id}/index.html`, placePage(atlas, code, id));
      }
    },
    // The dev server has no such files: a place path serves the atlas page, given the same <base> as the built file.
    transformIndexHtml(html, ctx) {
      const at = ctx.server && ctx.originalUrl ? placeOfPath(ctx.originalUrl.split('?')[0]) : null;
      return at ? placePage(html, at.code, at.id) : html;
    },
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const m = /^\/([a-z]{2})\/([a-z0-9-]+)\/(\?.*)?$/.exec(req.url ?? '');
        if (m && placeOfPath(`/${m[1]}/${m[2]}/`)) req.url = `/atlas/index.html${m[3] ?? ''}`;
        next();
      });
    },
  }],
  esbuild: { jsx: 'automatic' },
  define: { __DEBUG_FLAGS__: JSON.stringify(mode === 'development' || mode === 'uitest') },
  test: { include: ['tests/unit/**/*.test.ts'] },
}));
