import { defineConfig } from '@playwright/test';

// UI tests run against the built site, served under /Paraje/ as on GitHub Pages, with fixtures instead of the network.
export default defineConfig({
  testDir: 'tests/ui',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:4173/Paraje/', viewport: { width: 1280, height: 800 } },
  webServer: {
    command: 'npx vite build --logLevel error && npx vite preview --port 4173 --strictPort --base /Paraje/',
    url: 'http://localhost:4173/Paraje/', reuseExistingServer: false, timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
