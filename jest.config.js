// jest.config.js
// Sync object
module.exports = {
  verbose: true,
  rootDir: "./",
  //"collectCoverage": true,
  //"collectCoverageFrom": ["**/*.{js,vue}", "!**/node_modules/**"],
  transform: {".*\\.(vue)$": "vue-jest", ".*\\.(js)$": "babel-jest"},
  moduleNameMapper: {"^@/(.*)$": "<rootDir>/src/$1"}, //maps @ to src
};