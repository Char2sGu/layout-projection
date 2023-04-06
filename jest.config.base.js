module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  restoreMocks: true,
  transform: {
    ['^.+\\.(t|j)s$']: 'ts-jest',
  },
};
