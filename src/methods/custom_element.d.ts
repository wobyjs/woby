/**
 * Custom Element Implementation for Woby Framework
 *
 * This module provides functionality to create custom HTML elements with reactive properties
 * that integrate seamlessly with the Woby framework's observable system. Custom elements
 * created with this API can be used both in JSX/TSX and directly in HTML.
 *
 * Features:
 * - Automatic attribute to prop mapping
 * - Type conversion for observable props
 * - Nested property support (e.g., 'nested$prop$value' or 'nested.prop.value' in HTML, 'nested$prop$value' in JSX)
 * - Style property support (e.g., 'style$font-size' or 'style.font-size' in HTML, 'style$font-size' in JSX)
 * - Automatic kebab-case to camelCase conversion for all property names
 * - Automatic exclusion of properties with { toHtml: () => undefined } from HTML attributes
 * - Shadow DOM encapsulation with optional stylesheet adoption
 * - Context support for custom elements
 * - Custom serialization using toHtml and fromHtml options
 *
 * Style Encapsulation Options:
 * - ignoreStyle: Set to true to prevent adoption of global stylesheets in shadow DOM
 *
 * @module customElement
 */
import { Observable } from "soby";
import { Child, Component, ContextProvider } from "../types";
import { WobyCustomElementsRegistry, wobyCustomElements } from './custom_element_registry';
export { WobyCustomElementsRegistry, wobyCustomElements };
/**
 * Creates a mock custom element for SSR environments
 *
 * This function creates a mock implementation of a custom element for use in
 * server-side rendering environments where browser APIs are not available.
 *
 * @template P - Component props type
 * @param tagName - The HTML tag name for the custom element
 * @param component - The component function that renders the element's content (can be a regular component or Context.Provider)
 * @returns A mock custom element class
 */
export declare const createSSRCustomElement: <P extends {
    children?: Observable<Child>;
}>(tagName: string, component: Component<P> | ContextProvider<any>) => void;
export declare const setPendingContextWrap: (wrap: (fn: () => void) => void) => void;
export declare const consumePendingContextWrap: () => ((fn: () => void) => void) | undefined;
/**
 * Peek at the pending context wrap without consuming it.
 * Used by resolveContextRef as a fallback when no DOM-discoverable wrap exists
 * (invisible JSX providers with no enclosing custom element).
 * The wrap is NOT consumed because it may still be needed by a downstream
 * custom element's consumePendingContextWrap in the normal lifecycle.
 */
export declare const peekPendingContextWrap: () => ((fn: () => void) => void) | undefined;
/**
 * Compose a provider's own context-wrap onto the pending wrap.
 *
 * Called by the invisible JSX Context.Provider path (create_context.tsx) while a
 * custom element renders. Multiple nested providers within a single custom element
 * (e.g. Theme -> Counter -> Nested) each compose here so the element ends up storing
 * ONE composed SYMBOL_CONTEXT_WRAP that re-establishes the whole chain for slotted
 * descendants living in separate soby roots.
 *
 * Composition keeps the EARLIER (outer JSX) provider OUTER and the later (deeper)
 * provider INNER, mirroring the JSX nesting: prev(() => self(fn)).
 */
export declare const composePendingContextWrap: (selfWrap: (fn: () => void) => void) => void;
/**
 * Creates a browser custom element with reactive properties
 *
 * @param tagName - The HTML tag name for the custom element
 * @param component - The component function that renders the element's content (can be a regular component or Context.Provider)
 */
export declare const createBrowserCustomElement: <P extends {
    children?: Observable<JSX.Child>;
}>(tagName: string, component: JSX.Component<P> | ContextProvider<any>) => void;
/**
 * ElementAttributes type helper
 *
 * Simplified type to prevent excessive type instantiation depth when working with custom elements.
 * Combines HTML attributes with component-specific props.
 *
 * @template T - Component function type
 */
export type ElementAttributesPattern<P> = (keyof P extends string ? keyof P : never) | (keyof JSX.HTMLAttributes<HTMLElement> extends string ? keyof JSX.HTMLAttributes<HTMLElement> : never) | `style.${keyof JSX.StyleProperties extends string ? keyof JSX.StyleProperties : never}` | `style$${keyof JSX.StyleProperties extends string ? keyof JSX.StyleProperties : never}`;
export type ExtractProps<T> = T extends (props: infer P) => any ? P : never;
export type ElementAttributes1<T extends (...args: any) => any> = (T extends (props: infer P) => any ? Partial<(JSX.HTMLAttributes<HTMLElement> & ElementAttributesPattern<P>)> : Partial<JSX.HTMLAttributes<HTMLElement>>);
export type ElementAttributes<T extends (...args: any) => any> = Partial<JSX.HTMLAttributes<HTMLElement>> & Partial<Record<ElementAttributesPattern<ExtractProps<T>>, any>>;
/**
 * Creates a custom HTML element with reactive properties
 *
 * Defines a custom element that integrates with the Woby framework's observable system.
 * The element can observe attribute changes and update corresponding props automatically.
 * All props defined in the component's defaults are automatically observed as attributes.
 *
 * Requirements:
 * - Component must have default props defined using the `defaults` helper
 * - Component props that are observables will be updated with type conversion
 * - Component can be used in both JSX/TSX and HTML
 * - Accepts regular components or Context.Provider components
 *
 * @template P - Component props type
 * @param tagName - The HTML tag name for the custom element (must contain a hyphen)
 * @param component - The component function that renders the element's content (can be a regular component or Context.Provider)
 * @returns void
 *
 * @example
 * ```tsx
 * // Define a component with default props
 * const Counter = defaults(() => ({
 *   value: $(0, { type: 'number' } as const),
 *   title: $('Counter')
 * }), ({ value, title }: { value: Observable<number>, title: Observable<string> }) => (
 *   <div>
 *     <h1>{title}</h1>
 *     <p>Count: {value}</p>
 *     <button onClick={() => value(prev => prev + 1)}>+</button>
 *   </div>
 * ))
 *
 * // Register as a custom element
 * customElement('counter-element', Counter)
 *
 * // Usage in JSX:
 * // <counter-element value={5} title="My Counter" style$font-size="red"></counter-element>
 *
 * // Usage in HTML:
 * // <counter-element value="5" title="My Counter" style$font-size="red"></counter-element>
 * ```
 *
 * @example
 * ```tsx
 * // Register a Context.Provider as a custom element
 * const readerContext = createContext<string>()
 * customElement('reader-context', readerContext.Provider)
 *
 * // Usage in HTML:
 * // <reader-context value="outer">...</reader-context>
 * ```
 */
export declare const customElement: <P extends {
    children?: Observable<JSX.Child>;
}>(tagName: string, component: JSX.Component<P> | ContextProvider<any>) => void;
//# sourceMappingURL=custom_element.d.ts.map