import { defineConfig } from 'vite';

// GitHub Pages serves the site under /Paraje/ (the repo name) until atlaslope.com is pointed at it. A relative base works at any subpath and in any case,
// so dev, tests and the published site all use the same build.
export default defineConfig({
  base: './',
  test: { include: ['tests/unit/**/*.test.ts'] },
});
