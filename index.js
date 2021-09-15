const camelcase = require('camelcase')
const clonedeep = require('lodash.clonedeep')
const pkgName = '[cypress-dotenv]'

/**
 * Cypress dotenv plugin
 *
 * @param {object} cypressConfig - The cypress config object
 * @param {object} dotEnvConfig - (optional) The dotenv config object, ref: https://www.npmjs.com/package/dotenv#config
 * @param {boolean} all - (optional) Whether to return all env variables. If set to false (default), only env variables prefixed with CYPRESS_ are returned.
 * @returns {object} The cypress config with an augmented `env` property
 */
module.exports = (cypressConfig, dotEnvConfig, all = false) => {
  if (!cypressConfig) {
    console.warn(`${pkgName} did not receive a Cypress config object, so no environment variables will be applied`)
    return {}
  }

  const cypressPrefix = 'CYPRESS_'

  // load the content of the .env file, then parse each variable to the correct type (string, number, boolean, etc.)
  let envVars = require('dotenv').config(dotEnvConfig)

  // if no env vars were parsed, then there is nothing to do here (most likely an empty or non-existing .env file)
  if (envVars.parsed === undefined) {
    return cypressConfig
  }

  const dotenvParseVariables = require('dotenv-parse-variables')
  envVars = dotenvParseVariables(envVars.parsed)

  const enhancedConfig = clonedeep(cypressConfig)
  enhancedConfig.env = enhancedConfig.env || {}

  // get the name of all env vars that relate to cypress
  const cypressEnvVarKeys = all
    ? Object.keys(envVars)
    : Object.keys(envVars).filter((envName) => envName.startsWith(cypressPrefix))

  cypressEnvVarKeys.forEach((originalName) => {
    const pattern = new RegExp(`^${cypressPrefix}`, 'g')
    const cleanName = originalName.replace(pattern, '')
    const camelCaseName = camelcase(cleanName)
    const parsedEnvar = envVars[originalName]
    const processEnvVar = process.env[originalName]
    const envVar = typeof parsedEnvar === 'string' ? processEnvVar : parsedEnvar

    enhancedConfig.env[cleanName] = envVar

    if (enhancedConfig.hasOwnProperty(camelCaseName) && camelCaseName !== 'env') {
      enhancedConfig[camelCaseName] = envVar
    }
  })

  return enhancedConfig
}
