import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineConfig } from 'vitest/config';
import { transformWithEsbuild } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.TZ = 'UTC';
const workspaceCandidate = path.resolve(__dirname, '../..');
const projectRoot = fs.existsSync(
  path.join(workspaceCandidate, 'core/packages/volto'),
)
  ? workspaceCandidate
  : __dirname;
const voltoRoot = fs.existsSync(path.join(projectRoot, 'core/packages/volto'))
  ? path.join(projectRoot, 'core/packages/volto')
  : path.dirname(
      fileURLToPath(
        import.meta.resolve('@plone/volto/package.json'),
      ),
    );
const voltoSlateRoot = fs.existsSync(
  path.join(projectRoot, 'core/packages/volto-slate'),
)
  ? path.join(projectRoot, 'core/packages/volto-slate')
  : path.dirname(
      fileURLToPath(
        import.meta.resolve('@plone/volto-slate/package.json'),
      ),
    );
const componentsRoot = fs.existsSync(
  path.join(projectRoot, 'core/packages/components'),
)
  ? path.join(projectRoot, 'core/packages/components')
  : path.dirname(
      fileURLToPath(
        import.meta.resolve('@plone/components/package.json'),
      ),
    );
const registryRoot = fs.existsSync(
  path.join(projectRoot, 'core/packages/registry'),
)
  ? path.join(projectRoot, 'core/packages/registry')
  : path.dirname(
      fileURLToPath(import.meta.resolve('@plone/registry/package.json')),
    );

const requireFromVolto = createRequire(path.join(voltoRoot, 'package.json'));
const requireFromAddon = createRequire(path.join(__dirname, 'package.json'));
const voltoPackage = JSON.parse(
  fs.readFileSync(path.join(voltoRoot, 'package.json'), 'utf8'),
);

const baseConfig = (
  await import(pathToFileURL(path.join(voltoRoot, 'vitest.config.mjs')).href)
).default;
const setupGlobals = fs.existsSync(
  path.join(voltoRoot, 'test-setup-globals-vitest.js'),
)
  ? path.join(voltoRoot, 'test-setup-globals-vitest.js')
  : path.join(voltoRoot, 'test-setup-globals.js');
const addonsLoader = fs.existsSync(
  path.join(voltoRoot, 'test-addons-loader.js'),
)
  ? path.join(voltoRoot, 'test-addons-loader.js')
  : path.join(voltoRoot, 'jest-addons-loader.js');
const setupFiles = [
  setupGlobals,
  path.join(voltoRoot, 'test-setup-config.jsx'),
];
const setupAfterEnv = path.join(voltoRoot, 'jest-setup-afterenv.js');
if (fs.existsSync(setupAfterEnv)) setupFiles.push(setupAfterEnv);
setupFiles.push(addonsLoader);

const globalsFile = path.join(__dirname, 'vitest.globals.js');
if (fs.existsSync(globalsFile)) setupFiles.push(globalsFile);
const envFile = path.join(__dirname, '.env');
const useAddonSetup =
  !fs.existsSync(envFile) ||
  /^VITEST_USE_SETUP=ON(?:\s|$)/m.test(fs.readFileSync(envFile, 'utf8'));
const addonSetup = path.join(__dirname, 'vitest.setup.jsx');
if (useAddonSetup && fs.existsSync(addonSetup)) setupFiles.push(addonSetup);

function resolvePackageRoot(packageName) {
  for (const packageRequire of [requireFromAddon, requireFromVolto]) {
    try {
      return path.dirname(packageRequire.resolve(`${packageName}/package.json`));
    } catch {
      try {
        let current = path.dirname(packageRequire.resolve(packageName));
        while (current !== path.dirname(current)) {
          const manifest = path.join(current, 'package.json');
          if (fs.existsSync(manifest)) {
            const candidate = JSON.parse(fs.readFileSync(manifest, 'utf8'));
            if (candidate.name === packageName) return current;
          }
          current = path.dirname(current);
        }
      } catch {
        // Try the next package resolution context.
      }
    }
  }
  return null;
}

const addonPackage = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'),
);
const aliases = {
  ...(baseConfig.resolve?.alias ?? {}),
  '@plone/volto': path.join(voltoRoot, 'src'),
  '@plone/volto-slate': path.join(voltoSlateRoot, 'src'),
  '@plone/components': path.join(componentsRoot, 'src'),
  '@plone/registry': path.join(registryRoot, 'src'),
  '@root': path.join(voltoRoot, 'src'),
  '@package': path.join(__dirname, 'src'),
  '~': path.join(voltoRoot, 'src'),
  'load-volto-addons': addonsLoader,
  [addonPackage.name]: path.join(__dirname, 'src'),
};
function addSourceAlias(packageRoot) {
  const manifestPath = path.join(packageRoot, 'package.json');
  const sourceRoot = path.join(packageRoot, 'src');
  if (!fs.existsSync(manifestPath) || !fs.existsSync(sourceRoot)) return;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.name) aliases[manifest.name] = sourceRoot;
}

const workspacePackages = path.join(projectRoot, 'packages');
if (fs.existsSync(workspacePackages)) {
  for (const packageDirectory of fs.readdirSync(workspacePackages)) {
    addSourceAlias(path.join(workspacePackages, packageDirectory));
  }
}
const pnpmStore = path.join(projectRoot, 'node_modules/.pnpm');
if (fs.existsSync(pnpmStore)) {
  for (const storeDirectory of fs.readdirSync(pnpmStore)) {
    for (const scope of ['@eeacms', '@plone-collective']) {
      const scopeRoot = path.join(
        pnpmStore,
        storeDirectory,
        'node_modules',
        scope,
      );
      if (!fs.existsSync(scopeRoot)) continue;
      for (const packageDirectory of fs.readdirSync(scopeRoot)) {
        addSourceAlias(path.join(scopeRoot, packageDirectory));
      }
    }
  }
}

const excludedVoltoAliases = [
  'vitest',
  'vite',
  'jsdom',
  '@vitejs/plugin-react',
];
for (const dependency of Object.keys({
  ...(voltoPackage.dependencies ?? {}),
  ...(voltoPackage.devDependencies ?? {}),
})) {
  if (
    dependency in aliases ||
    excludedVoltoAliases.includes(dependency) ||
    dependency.startsWith('@vitest/') ||
    dependency.startsWith('@testing-library/')
  ) {
    continue;
  }
  const dependencyRoot = resolvePackageRoot(dependency);
  if (dependencyRoot) aliases[dependency] = dependencyRoot;
}
const workspaceSearchlib = path.join(
  projectRoot,
  'packages/volto-searchlib/searchlib',
);
const installedSearchlib = resolvePackageRoot('@eeacms/volto-searchlib');
const searchlibPath = fs.existsSync(workspaceSearchlib)
  ? workspaceSearchlib
  : fs.existsSync(path.join(__dirname, 'searchlib'))
    ? path.join(__dirname, 'searchlib')
    : installedSearchlib
      ? path.join(installedSearchlib, 'searchlib')
      : '';
if (fs.existsSync(searchlibPath)) aliases['@eeacms/search'] = searchlibPath;
const subsitesMock = path.join(
  __dirname,
  'src/__mocks__/volto-subsites-utils.js',
);
if (fs.existsSync(subsitesMock)) aliases['volto-subsites/utils'] = subsitesMock;
const localStorageMock = path.join(
  __dirname,
  'src/__mocks__/redux-localstorage-simple-original.js',
);
if (fs.existsSync(localStorageMock)) {
  aliases['redux-localstorage-simple-original'] = localStorageMock;
}
const uuidMock = path.join(__dirname, 'vitest.uuid.mock.js');
if (fs.existsSync(uuidMock)) aliases.uuid = uuidMock;
const jsxSourceRoots = Object.values(aliases).filter(
  (aliasPath) => typeof aliasPath === 'string',
);

const jsxInJsPlugin = {
  name: 'eea-addon-jsx-in-js',
  enforce: 'pre',
  transform(code, id) {
    const filePath = id.split('?')[0];
    if (
      !filePath.endsWith('.js') ||
      !jsxSourceRoots.some(
        (sourceRoot) =>
          filePath === sourceRoot ||
          filePath.startsWith(`${sourceRoot}${path.sep}`),
      )
    ) {
      return null;
    }
    return transformWithEsbuild(code, filePath, {
      loader: 'jsx',
      jsx: 'automatic',
    });
  },
};

export default defineConfig({
  plugins: [jsxInJsPlugin, ...(baseConfig.plugins ?? [])],
  define: {
    __CLIENT__: true,
    __DEVELOPMENT__: false,
    __SERVER__: false,
    __TEST__: true,
  },
  resolve: { alias: aliases },
  server: {
    fs: {
      allow: [projectRoot, __dirname],
    },
    deps: {
      inline: [/@eeacms/, /@plone/, /query-string/],
    },
  },
  test: {
    root: __dirname,
    isolate: true,
    globals: true,
    environment: 'jsdom',
    css: false,
    setupFiles,
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'searchlib/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    passWithNoTests: true,
    snapshotFormat: baseConfig.test?.snapshotFormat ?? {
      printBasicPrototype: false,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'cobertura'],
      reportsDirectory: process.env.COVERAGE_DIR ?? 'coverage',
      include: [
        'src/**/*.{js,jsx,ts,tsx}',
        'searchlib/**/*.{js,jsx,ts,tsx}',
      ],
      exclude: [
        'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
        'src/**/__tests__/**',
        'src/**/__mocks__/**',
        'src/**/*.d.ts',
        'src/**/index.{js,jsx,ts,tsx}',
        'src/**/*config.{js,jsx,ts,tsx}',
        'src/**/*schema.{js,jsx,ts,tsx}',
      ],
      thresholds: {
        branches: 5,
        functions: 5,
        lines: 5,
        statements: 5,
      },
    },
  },
});
