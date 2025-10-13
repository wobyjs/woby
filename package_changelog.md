# Changelog: `package.json`

## Version 1.58.28 - 1.58.33

### New Features
- Added a new `commit` script to streamline the version bumping and push process.

### Refactoring
- The `git` script was updated to use `git-cliff` for changelog generation.
- The repository URL was updated to `github:wongchichong/woby`.

### Housekeeping
- The `docs` folder has been included in the published files.
- Removed several scripts, including `changelog`, `release:automatic`, and `commit:help`.
- The `auto-changelog` dev dependency has been removed.

## Version 1.58.24 - 1.58.27

### New Features
- Added `ssr/jsx-dev-runtime` to the `exports` field.

### Bug Fixes
- Corrected paths in the `typesVersions` field.

### Dependency Updates
- Added a wide range of new dependencies and dev dependencies to enhance functionality and development experience, including:
  - `browserify-zlib`, `crypto-browserify`, `happy-dom`, `http-browserify`, `https-browserify`, `net`, `path-browserify`, `perf_hooks`, `stream-browserify`, `util`, `vm-browserify`
  - `@esbuild-plugins/node-globals-polyfill`, `@esbuild-plugins/node-modules-polyfill`, `@rollup/plugin-node-resolve`, `buffer`, `native-url`, `node-stdlib-browser`, `vite-plugin-node-polyfills`, `web-streams-polyfill`

## Version 1.58.20 - 1.58.23

### Breaking Changes
- The versioning scheme was updated from `0.58.x` to `1.58.x`.

### New Features
- Added `woby: link:` to the dependencies for local development.

## Version 0.58.11 - 0.58.19

### Bug Fixes
- Corrected the types path for `jsx-dev-runtime`.
- Updated the `exports` for `jsx-runtime` to point to the correct build artifacts.

## Version 0.58.10

### Breaking Changes
- The `oby` dependency has been renamed to `soby`.

## Version 0.58.5 - 0.58.9

### New Features
- Added a `clean` script to the package.
- The build process has been enhanced with the addition of `declaration` and `watch` scripts.

### Refactoring
- The `exports` field has been reordered for better readability.
- Updated `tsex` and `vite` dev dependencies.
- The `types` paths in the `exports` field have been updated.

## Version 0.58.0 - 0.58.4

### New Features
- The `release` script has been updated for a more streamlined release process.
- The `build` and `compile` scripts have been updated to generate declaration maps.

### Dependency Updates
- Updated `typescript` and other dev dependencies.
- The `oby` dependency has been updated.

## Version 0.57.13 - 0.57.14

### Bug Fixes
- Changed `jsx-runtime.ts` to `jsx-runtime.js` in the `files` array.