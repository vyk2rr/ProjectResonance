import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!tone/)"
  ],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy"
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"], 
  testMatch: [
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ]
};

export default config;