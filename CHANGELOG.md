version: 1.58.38
- Features:
  * Added GitHub Actions workflow for releases, triggered on new tags.
  * Enhanced documentation for custom elements, including:
    * New section on "Component Defaults and Two-Way Synchronization" explaining the `defaults` function, how two-way synchronization works, key requirements (observables, type information, `defaults` function), and handling different prop sources.
    * Detailed explanation of function storage in observables using array notation to hide them from HTML attributes.
    * Clarified object and date serialization using `toHtml` and `fromHtml` options.
  * New documentation for Context API (`doc/CONTEXT_API.md`).
  * New documentation for Custom Elements (`doc/CUSTOM_ELEMENTS.md`).
  * Added "Observable Options" and "Enhanced Observable Functions" sections to `doc/Core-Methods.md`.
- Refactorings:
  * Moved `CUSTOM_ELEMENTS.md` to `doc/CUSTOM_ELEMENTS.md`.
  * Moved `CONTEXT_API.md` to `doc/CONTEXT_API.md`.
  * Unified `useContext` and `useMountedContext` into a single `useContext` hook, which now supports both JSX/TSX and custom elements.
  * Updated `doc/Context.md` to reflect the unified `useContext` and removed `useMountedContext` specific sections.
  * Updated `doc/Core-Methods.md` to reflect the unified `useContext` and `$$` for observable unwrapping.
  * Added "Object Assignment (assign)" and "Component Defaults (defaults)" to the table of contents in `doc/Core-Methods.md`.
- Breaking Changes:
  * Removed the `useMountedContext` hook; its functionality is now integrated into `useContext`.

Generated using @missb/git-changelog