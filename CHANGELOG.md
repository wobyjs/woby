version: 0.46.2
- Features:
  * JSX functions now support children passed as rest parameters.
  * Expanded export of types from `index.ts` and `types.ts`.
- Refactorings:
  * `package.json` updated to use `exports` and `typesVersions` for improved module resolution and type declaration management.
  * Type declaration files are now generated into a `dist/types` directory using `vite-plugin-dts`.
  * The `Fragment` component now accepts and ignores additional properties.
  * The `Portal` component's `when` prop now consistently resolves observable values.
  * The `runtime.ts` file has been refactored to re-export from `jsx-runtime.ts`.
  * The testing `render` utility now uses a `div` element as the root for rendered components instead of a `DocumentFragment`.
  * The project name in `vite.config.ts` was corrected from "oby" to "voby".
  * Minor type assertion additions in various utility functions for improved type safety.
- Breaking Changes:
  * The project has transitioned away from a pnpm monorepo setup.
  * Changes to the `package.json` `exports` and `typesVersions` fields might alter how consumers import specific modules or types.

version: 1.58.32
- Features:
  * The `jsx` function now directly accepts children as parameters.
  * Introduced stylesheet utility functions (`convertAllDocumentStylesToConstructed`, `observeStylesheetChanges`, `unobserveStylesheetChanges`) to manage stylesheets for custom elements.
  * Added an `ignoreStyle` prop to `customElement` and `defaults` functions.
  * Added `isPureFunction` utility for distinguishing between reactive and non-reactive functions.
- Bug Fixes:
  * The `render` function in testing utilities was updated to use a `div` element instead of a document fragment for rendering, and its unmounting logic was revised.
- Refactorings:
  * Minor adjustments to the `Fragment` and `Portal` components for reactivity and typing.
  * The `resolveChild` function was significantly refactored to return `void`.
  * Type casting and function call adjustments were made in `src/utils/setters.ts` and `src/utils/setters.via.ts`.
  * Export paths in `ssr.d.ts`, `testing.d.ts`, and `via.d.ts` were updated to point to the new `dist/types` directory.
  * The `tsconfig.json` exclusion pattern for `dist` was slightly modified.
  * The `src/test/make.test.ts` file was deleted.
  * The `exports` and `typesVersions` fields in `package.json` were reordered and updated for clarity and consistency.
- Breaking Changes:
  * The `render` function in `src/methods/render.testing.ts` now expects an `Element` type for its `child` parameter instead of `Child`.

version: JSX Type System Enhancements
- Features:
  * Expanded JSX type definitions to include a comprehensive set of event handlers for touch, pointer, scroll, wheel, animation, and transition events.
  * Added extensive type definitions for HTML attributes across various elements, including standard, non-standard, RDFa, and Microdata attributes.
  * Introduced a complete set of SVG attribute type definitions for enhanced type safety and auto-completion in SVG elements.
  * Significantly expanded `IntrinsicElementsMap` and `IntrinsicElements` interfaces to provide detailed type mappings for all standard HTML and SVG elements and their corresponding attributes.
- Refactorings:
  * Removed redundant or outdated type definition files (`dist1/jsx/types.js`, `dist1/jsx/worker-type.d.ts`, `dist1/jsx/worker-type.js`).
  * Made JSX type definitions exportable for better accessibility.
  * Consolidated JSX type definitions into `src/jsx/types.ts`.
  * Updated references to `JSX.Element` to `Element` in `src/jsx/runtime.ts`.
  * Removed a duplicate JSX type definition file (`src/jsx/types.ts xx`).
  * Added a comment indicating that the `key` property in `HTMLAttributes` will be removed.
  * Exported various JSX interfaces and types for better module organization.
  * Modified the `EventHandler` type definition to remove the `this: never` constraint.
  * Removed a duplicate or old `types.ts` file from `src/jsx/`.
- Breaking Changes:
  * Removed the `key` property from the `HTMLAttributes` interface.

version: Core API Refinements and Testing Utilities
- Features:
  * Added `getByText` utility to `render.testing.ts` for querying elements by their text content in tests.
- Bug Fixes:
  * Improved `getByTestId` in `render.testing.ts` to throw an error if the element is not found.
  * Added validation for parent node type and dispose function in `render.via.ts`.
- Refactorings:
  * Standardized import and export statements across several files.
  * Simplified `cloneElement` function logic by removing the handling of children as a rest parameter and simplifying prop merging.
  * Updated `createContext` to use `useMemo` and a new `register` function for context values.
  * Updated `createDirective` to use `useMemo` and a new `register` function, and changed how directives are registered.
  * Modified `createElement` function signatures to include `_key`, `_isStatic`, `_source`, and `_self` parameters, and removed explicit handling of `children` and `ref` from props.
  * Updated `h` function signature to align with the new `createElement` signature.
  * Standardized formatting across multiple files (semicolons, parentheses).
  * Consolidated and re-organized type declarations, leading to the removal of `src/types/types.d.ts`.
  * Refactored SSR suspense mechanism in `render_to_string.ts` to use `Suspense` component and `SuspenseContext` with `useReaction`.
  * Removed `tick.ts` file.
- Breaking Changes:
  * Removed `hmr` (Hot Module Replacement) functionality.
  * Removed `tick` functionality.
  * Changed the `createElement` function signature, which might require updates in how elements are created and props are passed.
  * Changed the `h` function signature, which might require updates in how elements are created.
  * Removed `types/types.d.ts` file, potentially affecting type imports.
  * Modified `render` function signature in `render.via.ts` for the `parent` parameter type.
  * Removed `setAttribute` and `setChildReplacement` from the template reviver APIs in `template.via.ts`.
  * Removed several types from `src/types.ts` including `EffectFunction`, `EffectOptions`, `ExtractArray`, `ForOptions`, `Indexed`, `MemoOptions`, `ObservableLike`, `ObservableReadonlyLike`, `SuspenseCollectorData`.
  * Modified `Component` type to include `ComponentClass`.
  * Modified `ContextProvider` to accept `ObservableMaybe<T>` for `value`.
  * Modified `Context` type to include `register`.

version: Release Workflow & Documentation
- Features:
  * Added GitHub Actions workflow for releases, triggered on new tags.
  * Enhanced documentation for custom elements, including:
    * Detailed explanation of `ElementAttributes` and its benefits (automatic HTML attribute support, component prop typing, style property support, nested property support, IDE autocomplete).
    * Expanded JSX type augmentation section with examples for multiple custom elements, Unicode tag names, and complex props.
    * New section on "Component Defaults and Two-Way Synchronization" explaining the `defaults` function, how two-way synchronization works, key requirements (observables, type information, `defaults` function), and handling different prop sources.
    * Detailed explanation of function storage in observables using array notation to hide them from HTML attributes.
    * Clarified object and date serialization using `toHtml` and `fromHtml` options.
- Refactorings:
  * Moved `CUSTOM_ELEMENTS.md` to `docs/CUSTOM_ELEMENTS.md`.
  * Moved `CONTEXT_API.md` to `docs/CONTEXT_API.md`.

version: Build & Scripting Updates
- Features:
  * `npmjs` script now uses `--access public` for publishing.
  * Added `push` script to push commits and tags.
- Refactorings:
  * Changed `release` script to use `commit` instead of `bump`.
  * `bump` script now uses `--no-git-tag-version`.
  * `bump` script no longer uses `--no-git-tag-version`.
  * `commit` script includes `git` command before `bump` and `push`.

version: Module Structure Overhaul
- Refactorings:
  * The internal implementation of the `useResource` hook has been refactored.
- Breaking Changes:
  * Numerous compiled and distributed files under the `dist1` directory have been removed. This indicates a significant change in the project's module structure and potentially its public API.

Generated using @missb/git-changelog