const { defineConfig } = require('cypress')
const dotenvPlugin = require('./index')

module.exports = defineConfig({
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      const updatedConfig = dotenvPlugin(config, null, true)
      // continue loading other plugins

      return updatedConfig
    }
  }
})
