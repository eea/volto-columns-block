# volto-columns-block

[![Releases](https://img.shields.io/github/v/release/eea/volto-columns-block)](https://github.com/eea/volto-columns-block/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-columns-block%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-columns-block/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-columns-block&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-columns-block)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-columns-block&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-columns-block)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-columns-block&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-columns-block)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-columns-block&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-columns-block)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-columns-block%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-columns-block/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-columns-block&branch=develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-columns-block&branch=develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-columns-block&branch=develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-columns-block&branch=develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-columns-block&branch=develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-columns-block&branch=develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-columns-block&branch=develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-columns-block&branch=develop)

[Volto](https://github.com/plone/volto) add-on

## Features

This package gives you a block with columns. Each column is its own separate
blocks container.

![Initializing Columns Layout](https://raw.githubusercontent.com/eea/volto-columns-block/master/docs/initialize.png)
![Columns Edit Example](https://raw.githubusercontent.com/eea/volto-columns-block/master/docs/edit.png)
![Columns Sidebar](https://raw.githubusercontent.com/eea/volto-columns-block/master/docs/columns-sidebar.png)
![Single Column Sidebar](https://raw.githubusercontent.com/eea/volto-columns-block/master/docs/single-column-sidebar.png)
![Columns View Example](https://raw.githubusercontent.com/eea/volto-columns-block/master/docs/view.png)

## Getting started

### Try volto-columns-block with Docker

      git clone https://github.com/eea/volto-columns-block.git
      cd volto-columns-block
      make
      make start

Go to http://localhost:3000

`make start` now defaults to Volto 18. To run the same setup against Volto 17, use:

      VOLTO_VERSION=17 make
      VOLTO_VERSION=17 make start

### Add volto-columns-block to your Volto project

For Volto 18 and newer, create projects with Cookieplone. See the official
Plone documentation:
[Install Plone with Cookieplone](https://6.docs.plone.org/install/create-project-cookieplone.html)
and
[Install an add-on in Volto 18 and 19](https://6.docs.plone.org/volto/development/add-ons/install-an-add-on.html).

1. If you do not already have a project, create one:

   ```
   uvx cookieplone project
   cd project-title
   make install
   ```

1. Install the add-on in your Volto project:

   ```
   pnpm --filter <name-of-your-policy-add-on> add @eeacms/volto-columns-block
   ```

1. Add the add-on to `volto.config.js`:

   ```JavaScript
   const addons = ['@eeacms/volto-columns-block'];
   ```

1. Start Plone:

   ```
   make backend-start
   make frontend-start
   ```

1. Go to http://localhost:3000

1. Happy editing!

For legacy Volto 17 projects, keep using the yarn-based Volto 17 workflow.

## Upgrade

### Upgrading to 9.x

> This version requires `Volto >= 17.18` or `Volto 18+`. It removes the custom `EditBlockWrapper` and uses Volto's built-in block chrome provided by `BlocksForm`.

#### Breaking changes

- **Removed `EditBlockWrapper.jsx`.** Any code importing `EditBlockWrapper` from `@eeacms/volto-columns-block` will break. Use Volto's built-in `EditBlockWrapper` from `@plone/volto/components/manage/Blocks/Block/EditBlockWrapper` if you need a custom wrapper.
- **Moved the column-settings button into the block sidebar.** The floating `column.svg` icon button that appeared over each column in edit mode has been removed. Column settings are now accessible directly from the block sidebar via the `ColumnsWidget`.
- **`ColumnsBlockSchema` signature changed.** `ColumnsBlockSchema` now receives a single object `{ intl, formData }` instead of just `intl`. Any code calling `ColumnsBlockSchema(intl)` must be updated to `ColumnsBlockSchema({ intl, formData })`.

## Release

See [RELEASE.md](https://github.com/eea/volto-columns-block/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-columns-block/blob/master/DEVELOP.md).

## Secret Scanning

This repository uses the Betterleaks GitHub Action to scan the current
repository content on every push and pull request. The scan uses the rules in
`.gitleaks.toml` and uploads a `betterleaks-report` artifact when a finding is
detected.

There are three common outcomes:

1. **Everything is OK.** The `Betterleaks / Scan for secrets` check is green and
   no action is needed. Regular references to runtime values are OK, for example:

   ```js
   const tokenFromCookie = req.universalCookies.get('auth_token');
   ```

2. **A real secret was found.** The check is red and the workflow log asks you to
   download the `betterleaks-report` artifact. Open the artifact from the GitHub
   Actions run and check the reported file, line and rule. Remove the committed
   value, move it to the proper secret store, and rotate it if it was exposed.
   A report entry looks like this:

   ```json
   {
     "RuleID": "secret-literal-assignment",
     "File": "src/config.js",
     "StartLine": 12,
     "Secret": "[REDACTED]"
   }
   ```

3. **The finding is a false positive.** Keep the value only if it is clearly not
   sensitive, such as a test fixture, placeholder, or public example. Add
   `betterleaks:allow` on the same line and include a short explanation in the
   pull request.

   ```js
   const testPassword = 'admin'; //betterleaks:allow
   ```

   ```yaml
   password: "admin" #betterleaks:allow
   ```

Do not add `betterleaks:allow` to real credentials.

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-columns-block/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
