/**@type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  restoreMocks: true,
  transform: {
    ['^.+\\.(t|j)s$']: 'ts-jest',
  },
};
