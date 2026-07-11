/**
 * Context Reference Registry for @-prefix HTML Attribute Resolution
 *
 * Allows HTML attributes like `@scope.field` to auto-resolve context values
 * from ancestor providers without requiring useContext() inside the component.
 *
 * Usage:
 *   import { createContext, registerContextRef } from 'woby'
 *
 *   const themeCtx = createContext({ primary: '#000' })
 *   registerContextRef('theme.colors', themeCtx)
 *
 *   // Now any custom element can use:
 *   // <my-el color="@theme.colors">
 *
 * @module context_ref
 */
import type { Context } from '../types';
/**
 * Register a context for @-prefix resolution.
 *
 * @param name - The "scope.field" key used in @-prefixed attribute values
 * @param ctx - The context object created by createContext()
 *
 * @example
 *   const themeCtx = createContext({ primary: '#000' })
 *   registerContextRef('theme.colors', themeCtx)
 *   // Now <my-el color="@theme.colors"> resolves to the nearest provider's value
 */
export declare const registerContextRef: (name: string, ctx: Context<any>) => void;
/**
 * Unregister a context reference.
 */
export declare const unregisterContextRef: (name: string) => void;
/**
 * Check if a value string looks like an @-prefix context reference.
 * Returns true only if the string starts with exactly one @ (not @@).
 */
export declare const isContextRef: (value: unknown) => boolean;
/**
 * Resolve a @-prefix context reference to an observable value.
 *
 * Walks the DOM tree from the consuming element to find the nearest
 * provider of the registered context. Returns the context value
 * (which may be an observable, for reactivity).
 *
 * @param ref - The full @-prefix string (e.g. "@scope.field")
 * @param element - The consuming DOM element (optional; if absent, returns defaultValue)
 * @returns The resolved value (observable or static), or undefined if not found
 */
export declare const resolveContextRef: (ref: string, element?: Element) => any;
//# sourceMappingURL=context_ref.d.ts.map