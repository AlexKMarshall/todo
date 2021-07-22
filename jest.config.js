module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@components(.*)$': '<rootDir>/components$1',
    '^@context(.*)$': '<rootDir>/context$1',
    '^@pages(.*)$': '<rootDir>/pages$1',
    '^@icons(.*)$': '<rootDir>/icons$1',
    '^@features(.*)$': '<rootDir>/features$1',
    '^@services(.*)$': '<rootDir>/services$1',
    '^@types(.*)$': '<rootDir>/types$1',
    '\\.(jpg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  testEnvironment: 'jsdom',
}
