const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npx live-server --entry-file=404.html --port=8080 --no-browser',
    port: 8080,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
