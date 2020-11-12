// jest.config.js
// Sync object
module.exports = {
    "verbose": true,
    "rootDir": "./",
    //"collectCoverage": true,
    //"collectCoverageFrom": ["**/*.{js,vue}", "!**/node_modules/**"],
    "transform": {".*\\.(vue)$": "vue-jest", ".*\\.(js)$": "babel-jest"}
};