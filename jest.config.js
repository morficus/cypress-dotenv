module.exports = {
  reporters: ['default'],
  collectCoverage: true,
  testPathIgnorePatterns: ['/cypress/'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html']
}
