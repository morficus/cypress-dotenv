const camelcase = require('camelcase')
const clonedeep = require('lodash.clonedeep')

/**
 * Cypress dotenv plugin
 *
 * @param {object} cypressConfig - The cypress config object
 * @param {object} dotEnvConfig - (optional) The dotenv config object, ref: https://www.npmjs.com/package/dotenv#config
 * @returns {object} The cypress config with an augmented `env` property
 */
module.exports = (cypressConfig, dotEnvConfig) => {
  // load the content of the .env file, then parse each variable to the correct type (string, number, boolean, etc.)
  let envVars = require('dotenv').config(dotEnvConfig)
  const dotenvParseVariables = require('dotenv-parse-variables')
  envVars = dotenvParseVariables(envVars.parsed)

  let enhancedConfig = clonedeep(cypressConfig)
  enhancedConfig.env = enhancedConfig.env || {}

  // get the name of all env vars that relate to cypress
  const cypressEnvVarKeys = Object.keys(envVars).filter(envName => envName.startsWith('CYPRESS_'))

  cypressEnvVarKeys.forEach(originalName => {
    const cleanName = originalName.replace('CYPRESS_', '')
    const camelCaseName = camelcase(cleanName)
    enhancedConfig.env[cleanName] = envVars[originalName]

    // only overwrite Cypress config options that are infact valid options,
    // but ignore the `env` property... otherwise we will be in a world of pain
    if (enhancedConfig.hasOwnProperty(camelCaseName) && camelCaseName !== 'env') {
      enhancedConfig[camelCaseName] = envVars[originalName]
    }
  })

  return enhancedConfig
}
