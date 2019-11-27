/**
 * Cypress dotenv plugin
 *
 * @param {object} cypressConfig - The cypress config object
 * @param {object} dotEnvConfig - (optional) The dotenv config object, ref: https://www.npmjs.com/package/dotenv#config
 * @returns {object} The cypress config with an augmented `env` property
 */
module.exports = (cypressConfig, dotEnvConfig) => {
  require('dotenv').config(dotEnvConfig)

  // get the name of all env vars that relate to cypress
  const cypressEnvVars = Object.keys(process.env).filter(envName => envName.startsWith('CYPRESS_'))

  // create a new object with cypress-specific env vars, where the keys have the "CYPRESS_" prefix removed
  const newEnvVars = cypressEnvVars.reduce((acc, originalName) => {
    const cleanName = originalName.replace('CYPRESS_', '')
    acc[cleanName] = process.env[originalName]
    return acc
  }, {})

  cypressConfig.env = { ...cypressConfig.env, ...newEnvVars }

  return cypressConfig
}
