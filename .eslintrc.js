const fs = require('fs');
const path = require('path');
const projectRootPath = fs.realpathSync(__dirname + '/../../../');

let voltoPath = path.join(projectRootPath, 'node_modules/@plone/volto');
let configFile;
if (fs.existsSync(`${projectRootPath}/tsconfig.json`))
  configFile = `${projectRootPath}/tsconfig.json`;
else if (fs.existsSync(`${projectRootPath}/jsconfig.json`))
  configFile = `${projectRootPath}/jsconfig.json`;

if (configFile) {
  const jsConfig = require(configFile).compilerOptions;
  const pathsConfig = jsConfig.paths;
  if (pathsConfig['@plone/volto'])
    voltoPath = `./${jsConfig.baseUrl}/${pathsConfig['@plone/volto'][0]}`;
}

const AddonConfigurationRegistry = require(`${voltoPath}/addon-registry.js`);
const reg = new AddonConfigurationRegistry(projectRootPath);

// Extends ESlint configuration for adding the aliases to `src` directories in Volto addons
const addonAliases = Object.keys(reg.packages).map((o) => [
  o,
  reg.packages[o].modulePath,
]);

const addonExtenders = reg.getEslintExtenders().map((m) => require(m));

const defaultConfig = {
  extends: `${voltoPath}/.eslintrc`,
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@plone/volto', '@plone/volto/src'],
          ['@plone/volto-slate', '@plone/volto/packages/volto-slate/src'],
          ...addonAliases,
          ['@package', `${__dirname}/src`],
          ['@root', `${__dirname}/src`],
          ['~', `${__dirname}/src`],
        ],
        extensions: ['.js', '.jsx', '.json'],
      },
      'babel-plugin-root-import': {
        rootPathSuffix: 'src',
      },
    },
  },
  rules: {
    'react/jsx-no-target-blank': [
      'error',
      {
        allowReferrer: true,
      },
    ],
  }
};

const config = addonExtenders.reduce(
  (acc, extender) => extender.modify(acc),
  defaultConfig,
);

module.exports = config;
