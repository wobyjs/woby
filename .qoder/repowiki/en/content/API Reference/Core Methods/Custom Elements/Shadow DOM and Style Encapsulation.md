# Shadow DOM and Style Encapsulation

<cite>
**Referenced Files in This Document**   
- [custom_element.ts](file://src/methods/custom_element.ts)
- [stylesheets.ts](file://src/utils/stylesheets.ts)
</cite>

## Table of Contents
1. [Shadow DOM Integration](#shadow-dom-integration)
2. [Style Encapsulation Mechanism](#style-encapsulation-mechanism)
3. [Global Style Adoption](#global-style-adoption)
4. [Opt-Out of Style Adoption](#opt-out-of-style-adoption)
5. [Module-Level Stylesheet Observation](#module-level-stylesheet-observation)
6. [Styling with CSS Custom Properties](#styling-with-css-custom-properties)
7. [Common Issues and Solutions](#common-issues-and-solutions)

## Shadow DOM Integration

The Woby framework implements Shadow DOM integration through the `customElement` function, which creates custom HTML elements with encapsulated DOM trees. When a custom element is instantiated, its constructor attaches a shadow root using the `attachShadow` method with specific configuration options that enable encapsulation and serialization capabilities.

The shadow root is created with `mode: 'open'`, which allows external JavaScript to access the shadow DOM through the `element.shadowRoot` property while still maintaining style encapsulation. Additionally, the `serializable: true` option is specified, enabling the shadow root to be serialized, which is essential for server-side rendering and hydration scenarios.

This encapsulation ensures that the internal structure and styling of custom elements remain isolated from the global document, preventing style leakage and DOM conflicts. The shadow root serves as a boundary that contains all the element's internal markup, styles, and behavior, creating a self-contained component that can be safely reused throughout an application without affecting or being affected by external styles.

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L452-L641)

## Style Encapsulation Mechanism

The style encapsulation mechanism in Woby custom elements is implemented through a combination of Shadow DOM and constructed stylesheet adoption. When a custom element is constructed, it automatically creates a shadow root and adopts stylesheets that are converted to the Constructed StyleSheet format. This approach provides several advantages over traditional stylesheet linking, including better performance, easier manipulation, and improved security.

The encapsulation ensures that styles defined within the shadow root do not leak out to affect other elements in the document, and conversely, global styles do not penetrate into the shadow DOM by default. This creates a predictable styling environment where component styles are isolated and can be managed independently. The mechanism also supports dynamic style updates, allowing styles to be modified at runtime without requiring full component re-renders.

This encapsulation is particularly valuable in large applications with multiple teams working on different components, as it prevents style conflicts and ensures component consistency across different contexts and implementations.

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L452-L641)

## Global Style Adoption

Woby custom elements automatically adopt global styles through the `convertAllDocumentStylesToConstructed` utility function, which systematically processes all stylesheets in the document and converts them to Constructed StyleSheet objects. This function iterates through the `document.styleSheets` collection, extracts CSS rules from each stylesheet, and creates new `CSSStyleSheet` instances that can be adopted by shadow roots.

The process involves reading all CSS rules from existing stylesheets, concatenating them into a single CSS text string, and then using the `replaceSync` method to populate the constructed stylesheet. This conversion allows the styles to be efficiently shared across multiple custom elements while maintaining the performance benefits of constructed stylesheets.

To optimize performance, the function implements caching through the `cachedConstructedSheets` variable. When called multiple times, it returns the cached result instead of reprocessing all stylesheets, significantly reducing computational overhead. This caching mechanism ensures that style adoption is efficient even when numerous custom elements are created simultaneously.

**Section sources**
- [stylesheets.ts](file://src/utils/stylesheets.ts#L29-L59)
- [custom_element.ts](file://src/methods/custom_element.ts#L452-L641)

## Opt-Out of Style Adoption

Custom elements can opt out of global style adoption through the `ignoreStyle` prop, which provides a mechanism for creating truly isolated components that are completely unaffected by global styles. When a component sets `ignoreStyle` to `true` in its props, the style adoption process is bypassed, and the shadow root is created without adopting any global stylesheets.

This feature is particularly useful for components that require complete styling isolation, such as third-party widgets, design system components, or any element that must maintain consistent appearance regardless of the surrounding application context. It allows developers to create components with guaranteed visual consistency, preventing unintended style inheritance or conflicts with global CSS rules.

The opt-out mechanism is implemented as a simple boolean check in the custom element constructor, making it easy to use and understand. Components can conditionally enable or disable style adoption based on their configuration or runtime requirements, providing flexibility in how they integrate with the overall application styling.

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L452-L641)

## Module-Level Stylesheet Observation

The framework implements module-level stylesheet observation through the `observeStylesheetChanges` function, which establishes a single `MutationObserver` to monitor changes to stylesheets across the entire document. This observer watches for modifications to the document head and any changes to style or link elements throughout the document tree.

When stylesheet changes are detected, the observer invalidates the stylesheet cache by setting `cachedConstructedSheets` to `null`. This ensures that the next time `convertAllDocumentStylesToConstructed` is called, it will reprocess all stylesheets and return updated versions, keeping custom elements synchronized with the latest styling information.

The module-level approach is highly efficient because it requires only one observer for the entire application, regardless of how many custom elements are created. This singleton pattern prevents resource duplication and ensures consistent behavior across all components. The observation is initialized once when the module loads, and all subsequent custom elements benefit from the same change detection mechanism without additional overhead.

**Section sources**
- [stylesheets.ts](file://src/utils/stylesheets.ts#L75-L96)
- [custom_element.ts](file://src/methods/custom_element.ts#L452-L641)

## Styling with CSS Custom Properties

Custom elements in Woby can be styled using CSS custom properties (CSS variables), which provide a powerful mechanism for theming and configuration. CSS custom properties defined in the global scope or higher in the DOM tree can penetrate the shadow boundary and be accessed within the shadow DOM, enabling flexible styling patterns.

Components can define default values for custom properties within their shadow DOM while still allowing external customization. This approach supports both encapsulation and extensibility, as components maintain control over their base styling while exposing specific customization points through well-defined variables.

The framework's style adoption mechanism ensures that CSS custom properties from global stylesheets are available within custom elements, allowing for consistent theming across the application. Developers can create themeable components that respond to global style changes while maintaining their internal styling integrity.

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L452-L641)

## Common Issues and Solutions

Several common issues may arise when working with Shadow DOM and style encapsulation in Woby custom elements. Style conflicts can occur when global styles inadvertently affect components, which can be resolved by using the `ignoreStyle` prop for complete isolation or by refining CSS selectors to be more specific.

Performance considerations become important when creating many custom elements simultaneously, as each element processes and adopts stylesheets. The caching mechanism in `convertAllDocumentStylesToConstructed` helps mitigate this, but applications with numerous custom elements should monitor performance and consider lazy loading non-essential components.

Debugging style application problems can be challenging due to the encapsulation provided by Shadow DOM. Developers should use browser developer tools to inspect the shadow root structure and verify which stylesheets are being adopted. The console warnings in `convertAllDocumentStylesToConstructed` can help identify cross-origin stylesheet issues that prevent proper style adoption.

Understanding the timing of style adoption is crucial, as styles are processed during element construction. Dynamic style changes are handled through the mutation observer, but immediate style updates after element creation may require manual cache invalidation or direct manipulation of the adopted stylesheets.

**Section sources**
- [stylesheets.ts](file://src/utils/stylesheets.ts#L29-L96)
- [custom_element.ts](file://src/methods/custom_element.ts#L452-L641)