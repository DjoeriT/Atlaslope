import { defineConfig } from '@playwright/test';

// UI tests run against the dev server with fixtures, so no tile or data requests leave the machine;
// one smoke test runs against the production build with the real DO layer.
export default defineConfig({
  testDir: 'tests/ui',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:5173', viewport: { width: 1280, height: 800 } },
  webServer: [
    { command: 'npx vite --port 5173 --strictPort', url: 'http://localhost:5173', reuseExistingServer: true, timeout: 60_000 },
    // The built site, served under /Paraje/ as on GitHub Pages (tests/ui/built.spec.ts).
    {
      command: 'npx vite build --logLevel error && npx vite preview --port 4173 --strictPort --base /Paraje/',
      url: 'http://localhost:4173/Paraje/', reuseExistingServer: false, timeout: 120_000,
    },
  ],
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
