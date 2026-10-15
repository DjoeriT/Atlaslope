import { defineConfig } from 'vite';

// GitHub Pages serves the site under /paraje/ (the repo name, lower case); dev and tests use /.
export default defineConfig(({ command }) => ({
  base: command === 'build' && process.env.PAGES_BASE !== '/' ? '/paraje/' : '/',
  test: { include: ['tests/unit/**/*.test.ts'] },
}));
