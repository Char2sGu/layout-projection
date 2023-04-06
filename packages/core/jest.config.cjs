module.exports = {
  ...require('../../jest.config.base'),
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    ['^(\\.{1,2}/.*)\\.js$']: '$1',
  },
};
