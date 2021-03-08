# volto-columns-block
[![Releases](https://img.shields.io/github/v/release/eea/volto-columns-block)](https://github.com/eea/volto-columns-block/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-columns-block%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-columns-block/job/master/display/redirect)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-columns-block%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-columns-block/job/develop/display/redirect)

[Volto](https://github.com/plone/volto) add-on

## Features

This package gives you a block with columns. Each column is its own separate
blocks container.

###

![Initializing Columns Layout](https://raw.githubusercontent.com/eea/volto-columns-block/docs/docs/initialize.png)
![Columns Edit Example](https://raw.githubusercontent.com/eea/volto-columns-block/docs/docs/edit.png)
![Columns Sidebar](https://raw.githubusercontent.com/eea/volto-columns-block/docs/docs/columns-sidebar.png)
![Single Column Sidebar](https://raw.githubusercontent.com/eea/volto-columns-block/docs/docs/single-column-sidebar.png)
![Columns View Example](https://raw.githubusercontent.com/eea/volto-columns-block/docs/docs/view.png)

## Getting started

1. Create new volto project if you don't already have one:

   ```
   $ npm install -g yo @plone/generator-volto
   $ yo @plone/volto \
        my-volto-project \
        --addon @eeacms/volto-columns-block \
        --no-interactive \
        --skip-install

   $ cd my-volto-project
   $ yarn add -W @eeacms/volto-columns-block
   ```

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
      "@eeacms/volto-columns-block"
   ],

   "dependencies": {
       "@eeacms/volto-columns-block": "^2.0.0"
   }
   ```

1. Install new add-ons and restart Volto:

   ```
   $ yarn
   $ yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-columns-block/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-columns-block/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
