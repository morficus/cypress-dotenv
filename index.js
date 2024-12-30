const camelcase = require('camelcase')
const clonedeep = require('lodash.clonedeep')
const pkgName = '[cypress-dotenv]'

/**
 * Checks if something that was parsed as a number should be a string instead.
 * Specifically for cases where a number has a leading zero
 * See: https://github.com/morficus/cypress-dotenv/issues/32
 */
function checkIfTrulyNumber({ parsedValue, rawValue }) {
  let correctValue = parsedValue

  if (typeof parsedValue === 'number' && rawValue.startsWith('0')) {
    // if env var has a leading zero, then it must be a string and not a number
    correctValue = rawValue
  }

  return correctValue
}

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
  const rawEnvVars = require('dotenv').config(dotEnvConfig).parsed

  // if no env vars were found, then there is nothing to do here (most likely an empty or non-existing .env file)
  if (rawEnvVars === undefined || rawEnvVars === null || Object.keys(rawEnvVars).length === 0) {
    return cypressConfig
  }

  const dotenvParseVariables = require('dotenv-parse-variables')
  const parsedEnvVars = dotenvParseVariables(rawEnvVars)

  const enhancedConfig = clonedeep(cypressConfig)
  enhancedConfig.env = enhancedConfig.env || {}

  // get the name of all env vars that relate to cypress
  const cypressEnvVarKeys = all
    ? Object.keys(parsedEnvVars)
    : Object.keys(parsedEnvVars).filter((envName) => envName.startsWith(cypressPrefix))

  cypressEnvVarKeys.forEach((originalName) => {
    // remove the CYPRESS_ prefix from the env var name
    const pattern = new RegExp(`^${cypressPrefix}`, 'g')
    const cleanName = originalName.replace(pattern, '')

    // convert the env var name from snake_case to camelCase
    const camelCaseName = camelcase(cleanName)

    const parsedValue = parsedEnvVars[originalName]
    const rawValue = process.env[originalName]

    let effectiveValue = typeof parsedValue === 'string' ? rawValue : parsedValue

    if (typeof effectiveValue === 'number') {
      effectiveValue = checkIfTrulyNumber({ parsedValue: effectiveValue, rawValue })
    }

    enhancedConfig.env[cleanName] = effectiveValue

    if (enhancedConfig.hasOwnProperty(camelCaseName) && camelCaseName !== 'env') {
      enhancedConfig[camelCaseName] = effectiveValue
    }
  })

  return enhancedConfig
}
