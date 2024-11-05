/**@type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  clearMocks: true,
  restoreMocks: true,
  transform: {
    ['^.+\\.(t|j)s$']: 'ts-jest',
  },
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    ['^(\\.{1,2}/.*)\\.js$']: '$1',
  },
};
