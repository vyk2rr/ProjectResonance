module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { useESM: true }
    ],
  },
  "testEnvironment": "jsdom",
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy'
  },
};