# Core Methods

<cite>
**Referenced Files in This Document**   
- [render.ts](file://src/methods/render.ts)
- [render.ssr.ts](file://src/methods/render.ssr.ts)
- [render_to_string.ts](file://src/methods/render_to_string.ts)
- [render_to_string.ssr.ts](file://src/methods/render_to_string.ssr.ts)
- [create_element.ts](file://src/methods/create_element.ts)
- [create_element.ssr.ts](file://src/methods/create_element.ssr.ts)
- [create_element.via.ts](file://src/methods/create_element.via.ts)
- [h.ts](file://src/methods/h.ts)
- [h.via.ts](file://src/methods/h.via.ts)
- [custom_element.ts](file://src/methods/custom_element.ts)
- [lazy.ts](file://src/methods/lazy.ts)
- [lazy.ssr.ts](file://src/methods/lazy.ssr.ts)
- [lazy.via.ts](file://src/methods/lazy.via.ts)
</cite>

## Table of Contents
1. [render() Function](#render-function)
2. [createElement() Function](#createelement-function)
3. [h() Function](#h-function)
4. [customElement() Function](#customelement-function)
5. [lazy() Function](#lazy-function)
6. [renderToString() Function](#rendertostring-function)

## render() Function

The `render()` function is the primary method for mounting components to the DOM in Woby. It takes a child element and a parent node as parameters and returns a disposer function for cleanup.

When rendering to a DOM element or ShadowRoot, the function first validates that the parent is a valid HTMLElement or ShadowRoot. It then clears the parent's content and uses `useRoot()` to establish a reactive root context. The `setChild()` function is called to mount the component, and a disposer function is returned that will clean up the component and restore the parent's content when called.

The framework provides different implementations for various environments:
- Client-side rendering in `render.ts`
- Server-side rendering in `render.ssr.ts` which returns a string representation
- Testing environment rendering in `render.testing.ts`
- VIA environment rendering in `render.via.ts`

**Section sources**
- [render.ts](file://src/methods/render.ts#L8-L29)
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)
- [render.testing.ts](file://src/methods/render.testing.ts#L8-L80)
- [render.via.ts](file://src/methods/render.via.ts#L4-L24)

## createElement() Function

The `createElement()` function is responsible for creating elements from components, props, and children. It handles different types of components including functional components, class components, HTML elements, SVG elements, and custom elements.

For functional components, it calls the component function with the provided props. For class components, it instantiates the class with props. For string components (HTML tags), it creates the appropriate DOM node using `createHTMLNode` or `createSVGNode` based on whether the element is an SVG element.

The function includes special handling for custom elements through the `customElements.get()` API. When a custom element is detected, it creates an instance of the custom element class and sets up its props and shadow DOM.

A key feature is the validation that prevents providing children both as a prop and as rest arguments, which would create ambiguous rendering behavior.

**Section sources**
- [create_element.ts](file://src/methods/create_element.ts#L53-L129)
- [create_element.ssr.ts](file://src/methods/create_element.ssr.ts#L15-L79)
- [create_element.via.ts](file://src/methods/create_element.via.ts#L19-L80)

## h() Function

The `h()` function serves as a JSX-compatible hyperscript utility that acts as an alias for `createElement()`. It provides a more convenient syntax for creating elements in hyperscript style, particularly useful when not using JSX.

The function has multiple overloads to handle different parameter patterns:
- When children are provided as rest parameters or props is an object (not an array), it merges the children into the props object
- Otherwise, it treats the props parameter as a child and creates an element with null props

This flexibility allows developers to use the function in various coding styles while maintaining compatibility with JSX transpilation.

The framework provides environment-specific implementations in `h.ts`, `h.ssr.ts`, and `h.via.ts`, with the SSR version simply re-exporting `createElement` from the SSR module.

**Section sources**
- [h.ts](file://src/methods/h.ts#L8-L23)
- [h.via.ts](file://src/methods/h.via.ts#L8-L35)

## customElement() Function

The `customElement()` function enables integration with Web Components by creating custom HTML elements with reactive properties. It takes a tag name and a component function as parameters and returns a custom element class.

Key features include:
- Automatic attribute-to-prop mapping with kebab-case to camelCase conversion
- Support for nested properties using `$` or `.` notation (e.g., `user$name` or `user.name`)
- Style property support (e.g., `style$font-size` or `style.font-size`)
- Shadow DOM encapsulation with optional stylesheet adoption
- Type conversion for observable props with support for custom serialization via `toHtml` and `fromHtml` options
- Automatic exclusion of properties with `{ toHtml: () => undefined }` from HTML attributes

The custom element class extends `HTMLElement` and implements lifecycle callbacks:
- `constructor`: Sets up the element's props and shadow DOM
- `connectedCallback`: Sets up attribute observation and initializes the element
- `disconnectedCallback`: Cleans up resources
- `attributeChangedCallback1`: Handles attribute changes and updates corresponding props

Custom elements can be used directly in HTML without JavaScript initialization, making them ideal for progressive enhancement scenarios.

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L452-L641)

## lazy() Function

The `lazy()` function enables code splitting and asynchronous component loading. It takes a fetcher function that returns a Promise and returns a lazy component that can be used like any other component.

The implementation uses `useResource()` to manage the asynchronous loading state and `useResolved()` to handle the different states (pending, error, success). When the resource is resolved, it extracts the component (handling both default exports and direct exports) and creates an element with the provided props.

A key feature is the `preload()` method attached to the returned component, which allows for proactive loading of the component before it's needed. This enables optimization strategies like prefetching components that might be needed soon.

The function uses `once()` to ensure the fetcher is only called once, even if multiple instances of the lazy component are created, optimizing network usage.

**Section sources**
- [lazy.ts](file://src/methods/lazy.ts#L11-L59)
- [lazy.ssr.ts](file://src/methods/lazy.ssr.ts#L10-L58)
- [lazy.via.ts](file://src/methods/lazy.via.ts#L10-L58)

## renderToString() Function

The `renderToString()` function provides server-side rendering capabilities by converting a component to its HTML string representation. This is essential for server-side rendering, static site generation, and SEO optimization.

The client-side implementation returns a Promise that resolves when all suspense boundaries have been resolved, ensuring that asynchronous components are fully loaded before serialization. It uses a Portal component to capture the rendered content and waits for all pending suspenses before resolving.

The server-side implementation (`render_to_string.ssr.ts`) directly renders the component to a string without the asynchronous handling, as it operates in a synchronous context. It creates a container, sets the child content, and then extracts the HTML representation from the rendered elements.

Both implementations handle various node types, extracting `outerHTML` for DOM elements, `textContent` for text nodes, and converting other values to strings, ensuring comprehensive serialization of the component tree.

**Section sources**
- [render_to_string.ts](file://src/methods/render_to_string.ts#L12-L38)
- [render_to_string.ssr.ts](file://src/methods/render_to_string.ssr.ts#L6-L40)