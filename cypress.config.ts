import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    specPattern: 'cypress/e2e/**/*.{ts,tsx}',
    video: false
  },
  viewportWidth: 1280,
  viewportHeight: 800
});