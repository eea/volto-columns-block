const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 1280,
  retries: {
    runMode: 3,
  },
  // JUnit reporter so the EEA Jenkinsfile can publish Cypress results
  // (it copies cypress/reports/*.xml via `junit testResults: 'cypress-results-current/**/*.xml'`).
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/reports/cypress-[hash].xml',
    jenkinsMode: true,
    toConsole: true,
  },
  e2e: {
    // Register the code-coverage task so cypress/support/e2e.js's
    // `@cypress/code-coverage/support` has somewhere to send coverage to.
    // Coverage is only collected when the frontend is built/started with
    // babel-plugin-istanbul instrumentation (see Makefile `start-ci`).
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/tests/**/*.cy.{js,jsx,ts,tsx}',
  },
});
