const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1280,
  defaultCommandTimeout: 8888,
  chromeWebSecurity: false,
  reporter: 'junit',
  video: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  reporterOptions: {
    mochaFile: 'cypress/reports/cypress-[hash].xml',
    jenkinsMode: true,
    toConsole: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // e2e testing node events setup code
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
    baseUrl: 'http://localhost:3000',
  },
});
