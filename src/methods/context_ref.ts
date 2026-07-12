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

import { context, isObservable, $$ } from './soby'
import { OWNER } from 'soby'
import { CONTEXTS_DATA, SYMBOL_CONTEXT_WRAP } from '../constants'
import { peekPendingContextWrap } from './custom_element'
import type { Context } from '../types'

interface ContextRefEntry {
    symbol: symbol
    defaultValue: any
    context: Context<any>
}

const contextRefRegistry = new Map<string, ContextRefEntry>()

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
export const registerContextRef = (name: string, ctx: Context<any>): void => {
    const contextData = CONTEXTS_DATA.get(ctx)
    if (!contextData) {
        console.warn(`[woby] registerContextRef: context "${name}" has no CONTEXTS_DATA. Was it created with createContext()?`)
        return
    }
    contextRefRegistry.set(name, {
        symbol: contextData.symbol,
        defaultValue: contextData.defaultValue,
        context: ctx,
    })
}

/**
 * Unregister a context reference.
 */
export const unregisterContextRef = (name: string): void => {
    contextRefRegistry.delete(name)
}

/**
 * Check if a value string looks like an @-prefix context reference.
 * Returns true only if the string starts with exactly one @ (not @@).
 */
export const isContextRef = (value: unknown): boolean => {
    if (typeof value !== 'string') return false
    return value.startsWith('@') && !value.startsWith('@@')
}

/**
 * Walk DOM ancestors (crossing shadow boundaries) and collect
 * SYMBOL_CONTEXT_WRAP functions, then compose them into a single wrap.
 *
 * Mirrors collectAncestorContextWrap in custom_element.ts but avoids
 * importing from that module to prevent circular dependencies.
 */
const collectAncestorContextWrap = (el: Element): ((fn: () => void) => void) | undefined => {
    const wraps: ((fn: () => void) => void)[] = []
    let cur: any = (el as HTMLElement).parentNode
    while (cur) {
        const w = cur[SYMBOL_CONTEXT_WRAP]
        if (w) wraps.unshift(w)
        cur = cur.assignedSlot ?? cur.parentNode ?? cur.host ?? null
    }
    if (!wraps.length) return undefined
    return (fn: () => void) => {
        const run = wraps.reduceRight((inner: () => void, wrap) => () => wrap(inner), fn)
        run()
    }
}

/**
 * Parse a context reference string to find the registered key.
 *
 * Tries progressively shorter keys:
 *   "@scope.field.sub" → try "scope.field.sub", "scope.field", "scope"
 *
 * Returns the matching registered key, or null if no match found.
 */
const parseContextRef = (ref: string): string | null => {
    const rest = ref.startsWith('@') ? ref.slice(1) : ref
    const parts = rest.split('.')
    for (let i = parts.length; i >= 1; i--) {
        const candidate = parts.slice(0, i).join('.')
        if (contextRefRegistry.has(candidate)) {
            return candidate
        }
    }
    return null
}

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
export const resolveContextRef = (ref: string, element?: Element): any => {
    const refKey = parseContextRef(ref)
    if (!refKey) {
        console.warn(`[woby] @context-ref "${ref}" is not registered. Use registerContextRef() to register it.`)
        return undefined
    }

    const entry = contextRefRegistry.get(refKey)!
    const { symbol, defaultValue, context: ctx } = entry

    // Compute isStatic once — shared by all return sites
    const contextData = CONTEXTS_DATA.get(ctx)
    const isStatic = contextData ? $$(contextData.isStatic as any) : false

    if (!element) {
        // No element to walk from — return default value
        return defaultValue
    }

    // Determine if the element is connected to the DOM.
    // In the constructor (JSX path), element.isConnected is false.
    // In connectedCallback (HTML path), element.isConnected is true.
    const isConnected = element.isConnected

    // --- Resolution strategy ---
    //
    // Priority depends on the element's connection state:
    //
    // CONSTRUCTOR path (isConnected === false, JSX-created elements):
    //   1. peekPendingContextWrap() — the JSX <Provider> sets up a pending
    //      context wrap before creating children. This is the most reliable
    //      source for JSX-created elements.
    //   2. context(symbol) — fallback for when there's no pending wrap.
    //      NOTE: This returns the LAST provider's value in soby's ownership
    //      tree, which is wrong when multiple providers of the same context
    //      exist. Acceptable fallback only when pending wrap is empty.
    //   DOM walk is skipped — element not connected, no parentNode.
    //
    // CONNECTED path (isConnected === true, HTML-created elements):
    //   1. DOM ancestor walk (collectAncestorContextWrap) — walks the actual
    //      DOM tree to find the nearest provider with SYMBOL_CONTEXT_WRAP.
    //      This is reliable for HTML-created elements where providers are
    //      visible custom elements.
    //   2. peekPendingContextWrap() — fallback for invisible JSX providers
    //      in the connected path.
    //   3. context(symbol) — last resort.
    //
    if (isConnected) {
        // CONNECTED path: DOM walk first, then pending wrap, then context()

        // Step 1: Walk DOM ancestors to find SYMBOL_CONTEXT_WRAP.
        // This handles HTML-created custom elements where providers are
        // visible DOM nodes with the context-wrap function stored on them.
        const ancestorWrap = collectAncestorContextWrap(element)
        if (ancestorWrap) {
            let resolved: any = undefined
            ancestorWrap(() => {
                resolved = context(symbol)
            })
            if (resolved !== undefined) {
                const isObs = isObservable(resolved)
                if (isObs) return isStatic ? $$(resolved) : resolved
                return resolved
            }
        }

        // Step 2: Try the pending context wrap global.
        // Invisible JSX providers (no enclosing custom element) store their
        // context replay function in a global via composePendingContextWrap().
        const pendingWrap = peekPendingContextWrap()
        if (pendingWrap) {
            let resolved: any = undefined
            pendingWrap(() => {
                resolved = context(symbol)
            })
            if (resolved !== undefined) {
                return isStatic ? (isObservable(resolved) ? $$(resolved) : resolved) : resolved
            }
        }

        // Step 3: Fall back to ambient soby context.
        // This is the least reliable for connected elements because
        // context(symbol) returns the last provider's value in soby's
        // ownership tree, not the nearest DOM ancestor.
        const ambient = context(symbol)
        if (ambient !== undefined) {
            return isStatic
                ? (isObservable(ambient) ? $$(ambient) : ambient)
                : ambient
        }
    } else {
        // CONSTRUCTOR path: ambient context first, then pending wrap, skip DOM walk

        // Step 1: Try the ambient soby context.
        // JSX-created custom elements construct lazily INSIDE their provider's
        // context({...}, () => resolve(children)) call, so soby's dynamically
        // scoped context gives the correct nearest provider — including after
        // a nested sibling provider has closed (its scope is properly popped).
        // The pending-wrap global, by contrast, only ever ACCUMULATES nested
        // provider wraps (they must persist for the enclosing custom element's
        // consumePendingContextWrap capture), so a sibling constructed after a
        // nested provider would wrongly see that provider's value through it.
        const ambient = context(symbol)
        if (ambient !== undefined) {
            return isStatic
                ? (isObservable(ambient) ? $$(ambient) : ambient)
                : ambient
        }

        // Step 2: Fall back to the pending context wrap global for elements
        // constructed outside any provider's synchronous context scope.
        const pendingWrap = peekPendingContextWrap()
        if (pendingWrap) {
            let resolved: any = undefined
            pendingWrap(() => {
                resolved = context(symbol)
            })
            if (resolved !== undefined) {
                return isStatic ? (isObservable(resolved) ? $$(resolved) : resolved) : resolved
            }
        }
        // DOM walk skipped — element not connected to DOM.
    }

    // No provider found — return default value
    return defaultValue
}
