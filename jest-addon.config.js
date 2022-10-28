module.exports = {
  testMatch: ['**/src/addons/**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: [
    'src/addons/**/src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  moduleNameMapper: {
    '@plone/volto/cypress': '<rootDir>/node_modules/@plone/volto/cypress',
    '@plone/volto/babel': '<rootDir>/node_modules/@plone/volto/babel',
    '@plone/volto/(.*)$': '<rootDir>/node_modules/@plone/volto/src/$1',
    '@package/(.*)$': '<rootDir>/src/$1',
    '@root/(.*)$': '<rootDir>/src/$1',
    '@plone/volto-quanta/(.*)$': '<rootDir>/src/addons/volto-quanta/src/$1',
    '@eeacms/(.*?)/(.*)$': '<rootDir>/src/addons/$1/src/$2',
    '@plone/volto-slate':
      '<rootDir>/node_modules/@plone/volto/packages/volto-slate/src',
    '~/(.*)$': '<rootDir>/src/$1',
    'load-volto-addons':
      '<rootDir>/node_modules/@plone/volto/jest-addons-loader.js',
    '\\.(css|less|scss|sass)$':
      '<rootDir>/src/addons/$1/__mocks__/styleMock.js',
  },
  transform: {
    '^.+\\.js(x)?$': 'babel-jest',
    '^.+\\.(svg)$': './node_modules/@plone/volto/jest-svgsystem-transform.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-file',
  },
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  },
};
