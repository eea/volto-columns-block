module.exports = function (api) {
  api.cache(true);
  const presets = ['razzle'];
  const plugins = [
    '@babel/plugin-proposal-export-default-from',
    [
      'react-intl', // React Intl extractor, required for the whole i18n infrastructure to work
      {
        messagesDir: './build/messages/',
      },
    ],
  ];

  return {
    plugins,
    presets,
  };
};
