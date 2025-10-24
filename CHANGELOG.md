version: 1.58.32
- Features:
  * The `jsx` function now directly accepts children as parameters, enhancing flexibility in JSX usage.
  * Implemented `vite-plugin-dts` for generating TypeScript declaration files into a dedicated `dist/types` directory, improving type support.
  * Introduced stylesheet utility functions (`convertAllDocumentStylesToConstructed`, `observeStylesheetChanges`, `unobserveStylesheetChanges`) to manage stylesheets for custom elements, particularly with Shadow DOM.
  * Added an `ignoreStyle` prop to `customElement` and `defaults` functions, allowing control over stylesheet adoption within Shadow DOM.
  * Added `isPureFunction` utility for distinguishing between reactive and non-reactive functions.
- Bug Fixes:
  * The `render` function in testing utilities was updated to use a `div` element instead of a document fragment for rendering, and its unmounting logic was revised, potentially fixing issues in test environments.
- Refactorings:
  * Removed `pnpm-workspace.yaml`.
  * Minor adjustments to the `Fragment` and `Portal` components for reactivity and typing.
  * The `src/jsx/runtime.ts` file was refactored to export `jsx-runtime` and its previous content was commented out.
  * The `resolveChild` function was significantly refactored to return `void` and improve function resolution.
  * Type casting and function call adjustments were made in `src/utils/setters.ts` and `src/utils/setters.via.ts` for better type safety.
  * Export paths in `ssr.d.ts`, `testing.d.ts`, and `via.d.ts` were updated to point to the new `dist/types` directory.
  * The `tsconfig.json` exclusion pattern for `dist` was slightly modified.
  * The `src/test/make.test.ts` file was deleted.
  * The `exports` and `typesVersions` fields in `package.json` were reordered and updated for clarity and consistency.
- Breaking Changes:
  * The project name in `vite.config.ts` was changed from `"oby"` to `"voby"`, which might affect external build configurations.
  * The `render` function in `src/methods/render.testing.ts` now expects an `Element` type for its `child` parameter instead of `Child`, which could break existing tests.

version: JSX Type System Enhancements
- Features:
  * Expanded JSX type definitions to include a comprehensive set of event handlers for touch, pointer, scroll, wheel, animation, and transition events.
  * Added extensive type definitions for HTML attributes across various elements, including standard, non-standard, RDFa, and Microdata attributes.
  * Introduced a complete set of SVG attribute type definitions for enhanced type safety and auto-completion in SVG elements.
  * Significantly expanded `IntrinsicElementsMap` and `IntrinsicElements` interfaces to provide detailed type mappings for all standard HTML and SVG elements and their corresponding attributes.
- Refactorings:
  * Removed redundant or outdated type definition files (`dist1/jsx/types.js`, `dist1/jsx/worker-type.d.ts`, `dist1/jsx/worker-type.js`), indicating a consolidation and streamlining of the JSX type system.

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

Generated using @missb/git-changelog