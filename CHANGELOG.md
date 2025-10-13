# Changelog

This changelog provides a comprehensive overview of the repository's evolution, highlighting key features, major changes, and improvements based on the provided git history.

## [1.58.32] - 2025-10-13

This release introduces a major enhancement to Custom Element and Shadow DOM integration, a more powerful Context API, and advanced attribute handling capabilities.

### 🚀 Features

*   **Advanced Custom Element Integration**:
    *   Introduced robust support for creating and using Custom Elements that integrate seamlessly with Woby's reactive system.
    *   Components can be registered as custom elements using the `customElement` function, allowing them to be used directly in HTML.
    *   Full two-way synchronization between HTML attributes and component props is now supported for observables.

*   **Enhanced Nested Property Support**:
    *   A unique feature allowing deeply nested object properties and styles to be set directly from HTML attributes.
    *   Supports both dot-notation (`user.details.age="30"`) and dollar-sign notation (`user$details$age="30"`) for nested properties.
    *   Style properties can be set using `style.property` syntax (e.g., `style.font-size="1.2em"`). This is a **breaking change** from the previous `style-*` syntax.

*   **Custom Attribute Serialization**:
    *   Observable props can now define `toHtml` and `fromHtml` functions for custom serialization logic between JavaScript objects and HTML attribute strings.
    *   This enables seamless handling of complex data types like `Date` objects and JSON strings.
    *   Properties (especially functions) can be hidden from appearing as HTML attributes by providing a `toHtml` function that returns `undefined`.

*   **Upgraded Context API**:
    *   The Context API has been enhanced to work flawlessly across both standard components and Custom Elements, even traversing Shadow DOM boundaries.
    *   The new `useMountedContext` hook allows custom elements to access context provided by parent elements in the DOM tree.

*   **Function Properties in Custom Elements**:
    *   Functions can now be passed as props to custom elements by wrapping them in an observable array (e.g., `increment: $([() => { ... }])`).

### 📝 Documentation

*   **New Core Documentation**:
    *   Added `CONTEXT_API.md`: A comprehensive guide to the new Context API, including `createContext`, `useContext`, and the new `useMountedContext` hook.
    *   Added `CUSTOM_ELEMENTS.md`: Detailed documentation on creating, using, and configuring custom elements, including attribute mapping, type conversion, Shadow DOM, and context support.

*   **Major Documentation Overhaul**:
    *   The main `readme.md` has been significantly updated to reflect the new features, including dedicated sections for the Context API, Custom Elements, and Advanced Nested Property Support.
    *   Updated numerous documents to reflect the new APIs and best practices, including:
        *   `Component-Defaults.md`
        *   `Core-Methods.md`
        *   `Custom-Element-Best-Practices.md`
        *   `Type-Synchronization.md`
        *   `Woby-vs-React.md`
    *   All examples and code snippets have been updated to use the latest features, such as `.` notation for nested attributes and custom serialization.

### ⚠️ Breaking Changes

*   **Attribute Syntax for Nested Properties**: The syntax for setting nested properties and styles on custom elements has changed from a dash (`-`) to a dot (`.`).
    *   **Old**: `style-color="red"`, `nested-nested-text="xyz"`
    *   **New**: `style.color="red"`, `nested.nested.text="xyz"`
    *   This change improves consistency and enables more complex nested structures.

### Refactoring

*   **Reactive Core Name**: The documentation has been updated to clarify that Woby is built upon the **Soby** reactive core.
*   **Type Conversion Logic**: The internal type conversion logic for custom element attributes has been refactored to support the new `fromHtml` serialization option and handle a wider range of data types.