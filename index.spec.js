const plugin = require('./index')
const cypressConfigExample = {
  baseUrl: 'http://example.com',
  env: {},
  viewportWidth: 800,
  viewportHeight: 600
}

describe('Cypress dotenv plugin', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
  })

  it('Should load the content of the .env file', () => {
    plugin(cypressConfigExample)
    expect(process.env.CYPRESS_TEST_VAR).toBeDefined()
    expect(process.env.CYPRESS_TEST_VAR).toEqual('hello')

    expect(process.env.NON_CYPRESS_TEST_VAR).toBeDefined()
    expect(process.env.NON_CYPRESS_TEST_VAR).toEqual('goodbye')
  })

  it('Should do nothing if no CYPRESS_ env vars are present', () => {
    const dotenvConfig = { path: './.env.no-cypress' }
    const enhancedConfig = plugin(cypressConfigExample, dotenvConfig)

    expect(enhancedConfig.env).toEqual({})
  })

  it('Should only add CYPRESS_ vars to the config', () => {
    const enhancedConfig = plugin(cypressConfigExample)

    expect(enhancedConfig.env.TEST_VAR).toBeDefined()
    expect(enhancedConfig.env.TEST_VAR).toEqual('hello')
  })

  it('Should not alter any existing env vars that do not conflict', () => {
    const config = {
      ...cypressConfigExample,
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

  it('Should not alter existing CYPRESS_ environment variables', () => {
    process.env['CYPRESS_TEST_VAR'] = 'existing';

    plugin(cypressConfigExample)
    expect(process.env.CYPRESS_TEST_VAR).toBeDefined()
    expect(process.env.CYPRESS_TEST_VAR).not.toEqual('hello')
    expect(process.env.CYPRESS_TEST_VAR).toEqual('existing')
  })

  it('Should update any standard Cypress config keys, even if the .env key is in SNAKE_CASE', () => {
    const enhancedConfig = plugin(cypressConfigExample)

    expect(enhancedConfig.baseUrl).toEqual('http://google.com')
  })

  it('Should parse things that are numbers, as numbers', () => {
    const enhancedConfig = plugin(cypressConfigExample)
    expect(enhancedConfig.env.I_AM_NUMBER).toEqual(100)
  })

  it('Should parse things that are booleans, as booleans', () => {
    const enhancedConfig = plugin(cypressConfigExample)
    expect(enhancedConfig.env.I_AM_BOOLEAN).toEqual(true)
  })

  it('Should yield config.env as an object, even if there is a CYPRESS_ENV present', () => {
    const enhancedConfig = plugin(cypressConfigExample)
    expect(typeof enhancedConfig.env).toEqual('object')
  })

  it('Should not error out if there is no .env file present', () => {
    const dotenvConfig = { path: './non-existent-file' }
    const enhancedConfig = plugin(cypressConfigExample, dotenvConfig)

    expect(enhancedConfig.env).toEqual({})
    expect(enhancedConfig).toEqual(cypressConfigExample)
  })

  it('Should not error out if an empty Cypress config object is passed in', () => {
    const expectedOutput = {
      BASE_URL: 'http://google.com',
      ENV: 'testing',
      I_AM_BOOLEAN: true,
      I_AM_NUMBER: 100,
      TEST_VAR: 'hello'
    }
    const enhancedConfig = plugin({})

    expect(enhancedConfig.env).toEqual(expectedOutput)
    expect(enhancedConfig).toEqual({ env: expectedOutput })
  })

  it('Should not error out if an "undefined" Cypress config object is passed in', () => {
    global.console = {warn: jest.fn()}
    enhancedConfig = plugin(undefined)

    expect(enhancedConfig).toEqual({})
    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  describe('Optional all argument', () => {
    it('Should return all available env vars', () => {
      const dotenvConfig = { path: './.env' }
      const enhancedConfig = plugin(cypressConfigExample, dotenvConfig, true)

      expect(enhancedConfig.env).toEqual({
        BASE_URL: 'http://google.com',
        ENV: 'testing',
        I_AM_BOOLEAN: true,
        I_AM_NUMBER: 100,
        NON_CYPRESS_TEST_VAR: 'goodbye',
        TEST_VAR: 'hello'
      })
    })
  })
})
