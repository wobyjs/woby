# Changelog

## [1.58.32] - 2025-09-22

This release introduces a comprehensive suite of features focused on enhancing the integration of Custom Elements (Web Components) and improving the overall developer experience with a more powerful and flexible API.

### 🚀 Features

#### Custom Elements & Shadow DOM

-   **Advanced Nested Property Syntax**: Introduced a more intuitive dot-notation (`.`) for setting nested properties and styles on custom elements directly in HTML (e.g., `user.details.age="30"`, `style.color="blue"`). This complements the existing dollar-sign (`$`) notation and is not a feature available in React or SolidJS.
-   **Shadow DOM Context Penetration**: The context API now seamlessly works across Shadow DOM boundaries, allowing custom elements to consume context provided by parent elements in the light DOM.
-   **Function as Props**: Established a new pattern for passing functions as props to custom elements. Functions can now be wrapped in observables and hidden from HTML attributes, allowing for complex event handling.

#### Context API

-   **`useMountedContext` Hook**: A new specialized hook, `useMountedContext`, was introduced to allow custom elements to reliably access context values, even when used within a Shadow DOM.

#### Data Serialization

-   **Custom HTML Attribute Serialization**: Added `toHtml` and `fromHtml` options to observables. This allows developers to define custom logic for serializing and deserializing complex data types like Objects and Dates to and from HTML attributes, enabling robust two-way data binding for custom elements.

### 📚 Documentation

-   **New Top-Level Guides**: Added two comprehensive new documents:
    -   `CONTEXT_API.md`: A complete guide to the new, more powerful Context API.
    -   `CUSTOM_ELEMENTS.md`: Extensive documentation on creating and using custom elements with Woby, covering everything from basic usage to advanced features like nested properties and data serialization.
-   **Major Documentation Overhaul**: Updated nearly all existing documentation to reflect the new features and best practices. This includes significant updates to the main `readme.md`, `Component-Defaults.md`, `Custom-Element-Best-Practices.md`, and `Type-Synchronization.md`.
-   **Framework Correction**: Corrected the name of the core reactive library from "Woby" to "Soby" in the main `readme.md` to give proper credit.
-   **Soby Integration Documentation**: Updated documentation to reflect new Soby features including `toHtml`/`fromHtml` options for ObservableOptions and enhanced debugging with `DEBUGGER.verboseComment`.

### Changed

-   **Attribute Syntax**: The syntax for observing wildcard attributes on custom elements has been changed from a dash (`style-*`) to a dot (`style.*`) for better consistency with the new nested property syntax.