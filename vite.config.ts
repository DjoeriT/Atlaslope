import { defineConfig } from 'vite';
import { searchIndex } from './src/home/searchIndex';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { loadTree } from './src/tree';
import { placeOfPath, placePage, placePaths } from './src/paths';
import { fillGuideCount, fillStoryCount, guideRows, placeGuideCount, storyCount } from './src/home/guideCount';
import { fillCountryPage, fillGuidesIndex, fillHome } from './src/home/countryPages';
import { COUNTRIES, DEFAULT_COUNTRY, countryConfig } from './src/countries';
import { boxOf, splitOutlines } from './src/map/outlines';

// GitHub Pages serves the site under /Atlaslope/ (the repo name) until atlaslope.com is pointed at it. A relative base works at any subpath and in any case,
// so dev, tests and the published site all use the same build.
// Debug-only query flags (src/debug.ts) exist only in dev and in the UI-test build (`--mode uitest`); the production build compiles them out.
let outDir = 'dist';
// Each country's outlines, split from data/added-boundaries.geojson at build time (src/map/outlines.ts). The default country's file is
// part of the first load; every other country's goes under dist/map-data/ and loads when the map first shows it (option A, decision #38).
const outlineFile = (id: string) => `added-boundaries-${countryConfig(id).code}.geojson`;
const lazyOutlines = new Set(Object.keys(COUNTRIES).filter((id) => id !== DEFAULT_COUNTRY).map(outlineFile));
const outlines = () => splitOutlines(JSON.parse(readFileSync('data/added-boundaries.geojson', 'utf8')), JSON.parse(readFileSync('data/places.json', 'utf8')));

export default defineConfig(({ mode, command }) => ({
  base: './',
  // country/ is the template of the country pages: the build writes es/ and pt/ from it (one per country in src/countries.ts) and removes it.
  // Two pages (website slice 2): the home page at the root, the atlas at atlas/. Each is a real file, as GitHub Pages needs.
  // Everything a map tour loads goes under dist/story/, so Tools/check.sh can count it apart from the main site (own limit, owner 21 Oct 2026).
  build: { rollupOptions: {
    input: { home: 'index.html', atlas: 'atlas/index.html', guides: 'guides/index.html', country: 'country/index.html', about: 'about/index.html' },
    output: {
      // Each guide loads with its own page under dist/guide-data/, which the download check leaves out like dist/story/ (owner 22 Oct 2026).
      chunkFileNames: (c) => (c.isEntry ? 'assets/[name]-[hash].js'
        : c.moduleIds.some((m) => /\/(src\/story|content\/stories|data\/story)\//.test(m)) ? 'story/[name]-[hash].js'
        : c.moduleIds.every((m) => /\/content\/guides\//.test(m)) ? 'guide-data/[name]-[hash].js' : 'assets/[name]-[hash].js'),
      assetFileNames: (a) => ((a.originalFileNames ?? []).some((n) => n.startsWith('data/story/')) ? 'story/[name]-[hash][extname]'
        : (a.names ?? []).some((n) => lazyOutlines.has(n)) ? 'map-data/[name]-[hash][extname]' : 'assets/[name]-[hash][extname]'),
    },
  } },
  plugins: [{
    // The plain pages' search index, loaded on first focus (src/home/search.ts): names and ids only, a chunk of its own.
    name: 'search-index',
    resolveId: (id) => (id === 'virtual:search-index' ? '\0virtual:search-index' : undefined),
    load: (id) => (id === '\0virtual:search-index' ? `export default ${JSON.stringify(searchIndex())};` : undefined),
  }, {
    // virtual:outlines maps each country id to its outlines file's URL and box; the dev server serves them at /@outlines/<id>.geojson.
    name: 'country-outlines',
    resolveId: (id) => (id === 'virtual:outlines' ? '\0virtual:outlines' : undefined),
    load(id) {
      if (id !== '\0virtual:outlines') return undefined;
      this.addWatchFile('data/added-boundaries.geojson');
      this.addWatchFile('data/places.json');
      const parts = Object.entries(outlines());
      const url = (c: string, fc: object) => (command === 'serve' ? JSON.stringify(`/@outlines/${c}.geojson`)
        : `import.meta.ROLLUP_FILE_URL_${this.emitFile({ type: 'asset', name: outlineFile(c), source: JSON.stringify(fc) })}`);
      const files = parts.map(([c, fc]) => `${JSON.stringify(c)}: { url: ${url(c, fc)}, box: ${JSON.stringify(boxOf(fc) ?? [0, 0, 0, 0])} }`);
      return `export default { ${files.join(', ')} };`;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const m = /^\/@outlines\/([a-z]+)\.geojson$/.exec(req.url ?? '');
        const fc = m ? outlines()[m[1]] : undefined;
        if (!fc) return next();
        res.setHeader('Content-Type', 'application/geo+json');
        res.end(JSON.stringify(fc));
      });
    },
  }, { name: 'guide-count', transformIndexHtml: (html, ctx) => {
    // Every page that shows the guide count gets it; Home gets its country cards, the Guides page its country index.
    const out = fillStoryCount(fillGuideCount(html, placeGuideCount()), storyCount());
    const file = ctx.filename.replace(/\\/g, '/');
    if (file.endsWith('guides/index.html')) return fillGuidesIndex(out, guideRows());
    return out.includes('<!-- country-cards -->') ? fillHome(out, guideRows(), storyCount()) : out;
  } }, {
    // A page per country at <code>/ (es/, pt/), one file each, written from the built template country/index.html (owner 22 Oct 2026, option A).
    // The dev server serves the template at those paths, filled the same way.
    name: 'country-pages',
    writeBundle() {
      const template = readFileSync(`${outDir}/country/index.html`, 'utf8');
      const list = guideRows();
      for (const c of Object.values(COUNTRIES)) {
        mkdirSync(`${outDir}/${c.code}`, { recursive: true });
        writeFileSync(`${outDir}/${c.code}/index.html`, fillCountryPage(template, list, c.id));
      }
      rmSync(`${outDir}/country`, { recursive: true });
    },
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const m = /^\/([a-z]{2})\/(\?.*)?$/.exec(req.url ?? '');
        if (m && Object.values(COUNTRIES).some((c) => c.code === m[1])) req.url = `/country/index.html?c=${m[1]}`;
        next();
      });
    },
    transformIndexHtml(html, ctx) {
      const c = Object.values(COUNTRIES).find((x) => ctx.server && ctx.originalUrl?.startsWith(`/${x.code}/`));
      return c ? fillCountryPage(html, guideRows(), c.id) : html;
    },
  }, {
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
  test: { include: ['tests/unit/**/*.test.ts'], setupFiles: ['tests/unit/setup.ts'] },
}));
