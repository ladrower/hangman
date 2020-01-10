module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1'
  },
  testRegex: '((\\.|/)(spec))\\.tsx?$',
  setupFilesAfterEnv: ['<rootDir>/testsExtensions.ts'],
  globals: {
    ENVIRONMENT: 'PRODUCTION'
  }
}
