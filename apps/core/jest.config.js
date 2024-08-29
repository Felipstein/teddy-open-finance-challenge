/** @type {import('ts-jest').JestConfigWithTsJest} * */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  clearMocks: true,
  resetMocks: true,
  testMatch: ['<rootDir>/src/**/*.test.ts'],
};
