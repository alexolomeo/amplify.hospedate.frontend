export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.svg\\?react$': '<rootDir>/src/__mocks__/svgMock.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(nanostores|@nanostores/react|react-photo-album|yet-another-react-lightbo))',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testMatch: ['**/*.react.test.tsx'],
  preset: 'ts-jest/presets/js-with-ts-esm',
};
