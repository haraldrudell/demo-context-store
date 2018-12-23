const config = require('./babel.config');
const { join, resolve } = require('path');

const { createTransformer } = require('babel-jest');

module.exports = createTransformer({
  // babelrcRoots: packageGlob,
  ...config,
});