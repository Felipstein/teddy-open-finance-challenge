/** @type {import('ts-jest').JestConfigWithTsJest} * */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  moduleNameMapper: {
    '^@env$': '<rootDir>/src/env.ts',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@dependencies-hub$': '<rootDir>/src/infra/dependencies-hub.ts',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1',
    '^@main/(.*)$': '<rootDir>/src/main/$1',
    '^@swagger$': '<rootDir>/src/swagger.ts',
  },
  clearMocks: true,
  resetMocks: true,
  setupFilesAfterEnv: ['./tests/global.ts'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
};
