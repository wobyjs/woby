# Changelog: `package.json`

This document outlines the revision history of the `package.json` file, detailing the evolution of the project's metadata, dependencies, and build processes.

## Thematic Changes

### Versioning & Release Management

The project's versioning and release process has evolved significantly.

- **Initial State:** Versions were manually bumped.
- **`v0.58.4`:** Introduced structured release scripts:
  - `git`: Commits and pushes changes.
  - `bump`: Increments the patch version using `pnpm version patch`.
  - `npmjs`: Publishes the package.
  - `release`: A sequential script to run `git`, `bump`, and `npmjs`.
- **`v1.58.28` (and later):** The release process was automated further:
  - The `git` script was updated to use `git-cliff` for automatic `CHANGELOG.md` generation.
  - A `commit` script was added (`pnpm bump && pnpm push`).
  - Scripts for conventional commits (`commit`, `commit:help`) and automated releases (`release:automatic` using `semantic-release`) were added and later removed, indicating experimentation with different release workflows.

### Build System & Configuration

The build and compilation process has been refined for better development and production builds.

- **`v0.58.0`:** The `build` script was updated to include declaration file generation (`tsc --declaration --emitDeclarationOnly --declarationMap`).
- **`v0.58.5`:** The build process was split into more granular scripts:
  - `declaration` & `declaration:watch`
  - `build:only` & `watch:only`
  - `watch`: Combines `watch:only` and `declaration:watch`.
  - `build`: Runs `clean`, `build:only`, and `declaration` in sequence.
- **`v0.58.5`:** A `clean` script (`tsex clean`) was added and integrated into the main `build` script.

### Dependencies

- **`v0.58.10`:** The core reactivity dependency `oby` was renamed to `soby`.
- **`v1.58.24`:** A significant number of dependencies and devDependencies were added to improve browser compatibility and Node.js polyfills for the browser environment.
  - **Dependencies:** `browserify-zlib`, `crypto-browserify`, `happy-dom`, `http-browserify`, `https-browserify`, `net`, `path-browserify`, `perf_hooks`, `stream-browserify`, `util`, `vm-browserify`.
  - **DevDependencies:** `@esbuild-plugins/node-globals-polyfill`, `@esbuild-plugins/node-modules-polyfill`, `@rollup/plugin-node-resolve`, `buffer`, `native-url`, `node-stdlib-browser`, `vite-plugin-node-polyfills`, `web-streams-polyfill`.
- The dependency `vhtml` was removed around version `v1.58.24`.
- Workspace dependencies (`workspace:*`) were adopted for local packages like `soby` and `via.js`, improving monorepo management.

### Module Exports & Type Definitions

The way modules and their types are exposed to consumers has been a key area of evolution.

- **`v0.58.4`:** Type definition paths in the `exports` map were corrected to point to the `dist/types` directory instead of the root.
- **`v0.58.5`:** The `types` property was consistently placed as the first key within each entry in the `exports` map for better readability and to adhere to conventions.
- **`v1.58.24`:**
  - Added a separate `ssr/jsx-dev-runtime` export.
  - Corrected multiple paths in the `typesVersions` field to ensure TypeScript resolves the correct declaration files for different module entry points.

### Repository & Project Management

- The repository URL has switched between `github:wongchichong/woby` and `github:wobyjs/woby`, reflecting changes in ownership or organization.
- The `files` array was updated to include the `docs` directory, ensuring documentation is published with the package.

## Version History

The package has seen a rapid succession of patch and minor version bumps, indicating a fast pace of development and iteration.

- **`v0.57.14` -> `v0.58.0`**: Major version bump, signifying substantial changes.
- **`v0.58.0` -> `v0.58.20`**: A series of patch releases.
- **`v0.58.20` -> `v1.58.20`**: A major version jump from `0.x` to `1.x`, indicating a move towards a stable public API.
- **`v1.58.20` -> `v1.58.33`**: Continued patch releases, suggesting ongoing bug fixes, performance improvements, and minor feature additions.

### 📝 Documentation Updates

- **`v1.58.32`**: Updated documentation to reflect new Soby features including `toHtml`/`fromHtml` options for ObservableOptions and enhanced debugging with `DEBUGGER.verboseComment`.
- **`v1.58.32`**: Fixed typo in DEBUGGER documentation (`DEBUGGERER` → `DEBUGGER`).