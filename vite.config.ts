import { defineConfig } from 'vite';

// GitHub Pages serves the site under /Paraje/; dev and tests use /.
export default defineConfig(({ command }) => ({
  base: command === 'build' && process.env.PAGES_BASE !== '/' ? '/Paraje/' : '/',
  test: { include: ['tests/unit/**/*.test.ts'] },
}));
