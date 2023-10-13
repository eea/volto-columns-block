const defaultBabel = require('@plone/volto/babel');

function applyDefault(api) {
  const voltoBabel = defaultBabel(api);
  voltoBabel.plugins.push('istanbul');
  return voltoBabel;
}

module.exports = applyDefault;
