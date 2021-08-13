module.exports = {
  // resolver: '<rootDir>/jest-resolver.js',
  roots: ['.', '..'],
  testMatch: ['**/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/addons/**/src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  globals: {
    window: {},
    "__DEV__": true
  },
  moduleNameMapper: {
    '@plone/volto/cypress': '<rootDir>/node_modules/@plone/volto/cypress',
    '@plone/volto/babel': '<rootDir>/node_modules/@plone/volto/babel',
    '@plone/volto/(.*)$': '<rootDir>/node_modules/@plone/volto/src/$1',
    '@package/(.*)$': '<rootDir>/src/$1',
    '@plone/volto-quanta/(.*)$': '<rootDir>/src/addons/volto-quanta/src/$1',
    '@eeacms/(.*?)/(.*)$': '<rootDir>/src/addons/$1/src/$2',
    'volto-slate/(.*)$': '<rootDir>/src/addons/volto-slate/src/$1',
    '~/(.*)$': '<rootDir>/src/$1',
    'load-volto-addons':
      '<rootDir>/node_modules/@plone/volto/jest-addons-loader.js',
  },
  transform: {
    '^.+\\.js(x)?$': 'babel-jest',
    '^.+\\.css$': 'jest-css-modules',
    '^.+\\.less$': 'jest-css-modules',
    '^.+\\.scss$': 'jest-css-modules',
    '^.+\\.(png)$': 'jest-file',
    '^.+\\.(jpg)$': 'jest-file',
    '^.+\\.(svg)$': './node_modules/@plone/volto/jest-svgsystem-transform.js',
  },
  coverageThreshold: {
    global: {
      branches: 4,
      functions: 4,
      lines: 4,
      statements: 4,
    },
  },
};

//
// module.exports = {
//   // resolver: '<rootDir>/jest-resolver.js',
//
//   verbose: true,
//   testMatch: [
//     '**/src/addons/**/?(*.)+(spec|test).[jt]s?(x)',
//     '../src/?(*.)+(spec|test).[jt]s?(x)',
//     '?(*.)+(spec|test).[jt]s?(x)'
//   ],
//   collectCoverageFrom: [
//     'src/addons/**/src/**/*.{js,jsx,ts,tsx}',
//     '!src/**/*.d.ts',
//   ],
//   moduleNameMapper: {
//     '@plone/volto/cypress': '<rootDir>/node_modules/@plone/volto/cypress',
//     '@plone/volto/babel': '<rootDir>/node_modules/@plone/volto/babel',
//     '@plone/volto/(.*)$': '<rootDir>/node_modules/@plone/volto/src/$1',
//     '@package/(.*)$': '<rootDir>/src/$1',
//     '@plone/volto-quanta/(.*)$': '<rootDir>/src/addons/volto-quanta/src/$1',
//     '@eeacms/(.*?)/(.*)$': '<rootDir>/src/addons/$1/src/$2',
//     'volto-slate/(.*)$': '<rootDir>/src/addons/volto-slate/src/$1',
//     '~/(.*)$': '<rootDir>/src/$1',
//     'load-volto-addons': '<rootDir>/node_modules/@plone/volto/jest-addons-loader.js',
//   },
//   transform: {
//     '^.+\\.js(x)?$': 'babel-jest',
//     '^.+\\.css$': 'jest-css-modules',
//     '^.+\\.less$': 'jest-css-modules',
//     '^.+\\.scss$': 'jest-css-modules',
//     '^.+\\.(png)$': 'jest-file',
//     '^.+\\.(jpg)$': 'jest-file',
//     '^.+\\.(svg)$': './node_modules/@plone/volto/jest-svgsystem-transform.js',
//   },
//
//   // "transformIgnorePatterns": [
//   //   "/node_modules/(?!@plone/volto).+\\.js$",
//   //   "/node_modules/(?!@eeacms/volto-columns-block).+\\.js$"
//   // ],
//   transformIgnorePatterns: [
//     // "node_modules\/(?!@plone\/volto).+\\.js$"
//   ],
//
//   "testPathIgnorePatterns": [
//     // "node_modules\/(?!@eeacms\/volto-columns-block).+\\.js$"
//   ],
//
//
//   coverageThreshold: {
//     global: {
//       branches: 5,
//       functions: 5,
//       lines: 5,
//       statements: 5,
//     },
//   },
//   haste: {
//     enableSymlinks: true,
//   },
// };
