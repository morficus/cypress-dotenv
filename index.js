const camelcase = require('camelcase')
const clonedeep = require('lodash.clonedeep')

/**
 * Cypress dotenv plugin
 *
 * @param {object} cypressConfig - The cypress config object
 * @param {object} dotEnvConfig - (optional) The dotenv config object, ref: https://www.npmjs.com/package/dotenv#config
 * @param {boolean} all - (optional) Whether to return all env variables. If set to false (default), only env variables prefixed with CYPRESS_ are returned.
 * @returns {object} The cypress config with an augmented `env` property
 */
module.exports = (cypressConfig, dotEnvConfig, all = false) => {
  // load the content of the .env file, then parse each variable to the correct type (string, number, boolean, etc.)
  let envVars = require('dotenv').config(dotEnvConfig)
  const dotenvParseVariables = require('dotenv-parse-variables')
  envVars = dotenvParseVariables(envVars.parsed)

  let enhancedConfig = clonedeep(cypressConfig)
  enhancedConfig.env = enhancedConfig.env || {}

  // get the name of all env vars that relate to cypress
  const cypressEnvVarKeys = all
    ? Object.keys(envVars)
    : Object.keys(envVars).filter(envName => envName.startsWith('CYPRESS_'))

  cypressEnvVarKeys.forEach(originalName => {
    const cleanName = originalName.replace('CYPRESS_', '')
    const camelCaseName = camelcase(cleanName)
    enhancedConfig.env[cleanName] = envVars[originalName]

    if (enhancedConfig.hasOwnProperty(camelCaseName) && camelCaseName !== 'env') {
      enhancedConfig[camelCaseName] = envVars[originalName]
    }
  })

  return enhancedConfig
}
