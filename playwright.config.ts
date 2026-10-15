import { defineConfig } from '@playwright/test';

// UI tests run against the dev server with fixtures, so no tile or data requests leave the machine.
export default defineConfig({
  testDir: 'tests/ui',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:5173', viewport: { width: 1280, height: 800 } },
  webServer: { command: 'npx vite --port 5173 --strictPort', url: 'http://localhost:5173', reuseExistingServer: true, timeout: 60_000 },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
