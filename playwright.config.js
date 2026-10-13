import { defineConfig, devices } from '@playwright/test';

// End-to-end tests: they drive the real app in a real browser, unlike the unit tests in
// test/, which use a simulated browser. Run them with `npm run test:e2e`.
export default defineConfig({
  testDir: './e2e',
  // Each test starts with a fresh browser context: no cookies and no saved answers.
  fullyParallel: true,
  // The HTML report is served on all addresses, on a port the lab's reverse proxy forwards
  // (5000–5005 and 8100–8105), so it opens at https://<hostname>:5001.
  reporter: [['list'], ['html', { open: 'never', host: '0.0.0.0', port: 5001 }]],
  use: {
    baseURL: 'http://localhost:5000',
    // Keep a step-by-step trace when a test fails and is retried, to see what went wrong.
    trace: 'on-first-retry',
  },
  retries: 1,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Starts the dev server if one isn't already running on port 5000, and reuses it if it is.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5000',
    reuseExistingServer: true,
  },
});
