const camelcase = require('camelcase')
const clonedeep = require('clonedeep')

/**
 * Cypress dotenv plugin
 *
 * @param {object} cypressConfig - The cypress config object
 * @param {object} dotEnvConfig - (optional) The dotenv config object, ref: https://www.npmjs.com/package/dotenv#config
 * @returns {object} The cypress config with an augmented `env` property
 */
module.exports = (cypressConfig, dotEnvConfig) => {
  require('dotenv').config(dotEnvConfig)

  let enhancedConfig = clonedeep(cypressConfig)
  enhancedConfig.env = enhancedConfig.env || {}

  // get the name of all env vars that relate to cypress
  const cypressEnvVarKeys = Object.keys(process.env).filter(envName => envName.startsWith('CYPRESS_'))

  // this will hold env vars whos name/key has been turned in to cameCase (this is to deal with Cypress config env vars)
  // const camelCaseEnvVars = {}
  // and this will just hold the env var with the unaltered name
  // const originalCaseEnvVars = {}

  cypressEnvVarKeys.forEach(originalName => {
    const cleanName = originalName.replace('CYPRESS_', '')
    const camelCaseName = camelcase(cleanName)
    enhancedConfig.env[cleanName] = process.env[originalName]
    if (enhancedConfig.hasOwnProperty(camelCaseName)) {
      enhancedConfig[camelCaseName] = process.env[originalName]
    }
  })

  return enhancedConfig
}
