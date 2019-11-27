const plugin = require('./index')

describe('Cypress dotenv plugin', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
  })

  it('Should load the content of the .env file', () => {
    plugin({})
    expect(process.env.CYPRESS_TEST_VAR).toBeDefined()
    expect(process.env.CYPRESS_TEST_VAR).toEqual('hello')

    expect(process.env.NON_CYPRESS_TEST_VAR).toBeDefined()
    expect(process.env.NON_CYPRESS_TEST_VAR).toEqual('goodbye')
  })

  it('Should do nothing if no CYPRESS_ env vars are present', () => {
    const cypessConfig = {}
    const dotenvConfig = { path: './.env.no-cypress' }
    const enhancedConfig = plugin(cypessConfig, dotenvConfig)

    expect(enhancedConfig.env).toEqual({})
  })

  it('Should only add CYRESS_ vars to the config', () => {
    const config = {}
    const enhancedConfig = plugin(config)

    expect(enhancedConfig.env.TEST_VAR).toBeDefined()
    expect(enhancedConfig.env.TEST_VAR).toEqual('hello')
  })

  it('Should not alter any existing env vars that do not conflict', () => {
    const config = {
      env: {
        SOME_OTHER_ENV_VAR: 'hey there'
      }
    }
    const enhancedConfig = plugin(config)

    expect(enhancedConfig.env.TEST_VAR).toBeDefined()
    expect(enhancedConfig.env.TEST_VAR).toEqual('hello')

    expect(enhancedConfig.env.SOME_OTHER_ENV_VAR).toBeDefined()
    expect(enhancedConfig.env.SOME_OTHER_ENV_VAR).toEqual('hey there')
  })
})
