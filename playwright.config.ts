import { defineConfig } from '@playwright/test';

// UI tests run against a separate build (--mode uitest keeps the debug flags; the production build in dist/ has none), served under /Atlaslope/ as on GitHub Pages, with fixtures instead of the network.
export default defineConfig({
  testDir: 'tests/ui',
  timeout: 30_000,
  use: { baseURL: 'http://localhost:4173/Atlaslope/', viewport: { width: 1280, height: 800 } },
  webServer: {
    command: 'npx vite build --mode uitest --outDir dist/uitest --logLevel error && npx vite preview --outDir dist/uitest --port 4173 --strictPort --base /Atlaslope/',
    url: 'http://localhost:4173/Atlaslope/', reuseExistingServer: false, timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
