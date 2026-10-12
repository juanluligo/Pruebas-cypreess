const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'zgs6a1',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
