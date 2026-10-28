// Coverage-enabled variant of the Volto babel config. `make start-ci` copies
// this file over core/packages/volto/babel.config.js so that
// babel-plugin-istanbul instruments the app and Cypress can collect
// end-to-end coverage.
//
// Instrumenting the whole workspace breaks the client build (webpack 5 pulls
// server-only code in once tree-shaking is disabled), so only the add-on
// sources are instrumented: they are the only ones SonarQube analyses.
// `cwd` must be the workspace root (/app), otherwise test-exclude would
// ignore the add-on files, which live outside the Volto core package.
const path = require('path');

const defaultBabel = require('./babel');

const workspaceRoot = path.resolve(__dirname, '../../..');

module.exports = function (api) {
  const voltoBabel = defaultBabel(api);
  voltoBabel.plugins.push([
    'istanbul',
    {
      cwd: workspaceRoot,
      include: ['packages/*/src/**'],
    },
  ]);
  return voltoBabel;
};
