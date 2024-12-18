// jest.config.js
module.exports = {
  verbose: true,
  preset: 'ts-jest', // Use ts-jest to transform TypeScript files
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
  },
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'], // Recognize TypeScript and JavaScript files
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // If you use custom paths in tsconfig
  },
  extensionsToTreatAsEsm: ['.ts'], // Treat .ts files as ESModules
  transformIgnorePatterns: [
    'node_modules/(?!yaml)', // Ignore everything in node_modules except yaml
  ]
};