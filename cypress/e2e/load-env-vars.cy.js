describe('Environment variables', () => {
  it('Should load env vars, regardless of CYPRESS_ prefix', () => {
    expect(Cypress.env('TEST_VAR')).to.be.a('string')
    expect(Cypress.env('NON_CYPRESS_TEST_VAR')).to.be.a('string')
  })

  it('Should convert env vars to their proper types', () => {
    expect(Cypress.env('BASE_URL')).to.be.a('string')
    expect(Cypress.env('I_AM_NUMBER')).to.be.a('number')
    expect(Cypress.env('I_AM_BOOLEAN')).to.be.a('boolean')
  })
})
