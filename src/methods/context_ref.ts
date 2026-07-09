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

import { context, isObservable } from './soby'
import { OWNER } from 'soby'
import { CONTEXTS_DATA, SYMBOL_CONTEXT_WRAP } from '../constants'
import { peekPendingContextWrap } from './custom_element'
import type { Context } from '../types'

interface ContextRefEntry {
    symbol: symbol
    defaultValue: any
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
    const { symbol, defaultValue } = entry

    if (!element) {
        // No element to walk from — return default value
        return defaultValue
    }

    // Step 1: Try the ambient soby context FIRST.
    // Pure JSX providers (invisible <Context.Provider> with no enclosing
    // custom element) establish context via soby's context() function at
    // render time, NOT via DOM-visible SYMBOL_CONTEXT_WRAP. The ambient
    // context is available as long as we're inside the soby ownership tree
    // created by the Provider's context({ [symbol]: value }, fn) call.
    const ambient = context(symbol)
    if (ambient !== undefined) {
        return isObservable(ambient) ? ambient() : ambient
    }

    // Step 1.5: Try the pending context wrap global (_pendingContextWrapGlobal).
    // Invisible JSX providers (no enclosing custom element) store their context
    // replay function in a global via composePendingContextWrap(). When no
    // custom element consumes it (consumePendingContextWrap), the wrap remains
    // available. This fallback invokes the wrap and tries context(symbol) inside.
    const pendingWrap = peekPendingContextWrap()
    if (pendingWrap) {
        let resolved: any = undefined
        pendingWrap(() => {
            resolved = context(symbol)
        })
        if (resolved !== undefined) {
            return isObservable(resolved) ? resolved() : resolved
        }
    }

    // Step 2: Walk DOM ancestors to find SYMBOL_CONTEXT_WRAP and resolve context.
    // This handles providers that ARE visible custom elements (e.g. <ctx-ref-provider>
    // wrapping slotted children in raw HTML). These providers store a context-replay
    // function on their DOM node, which collectAncestorContextWalk discovers.
    // The DOM walk is only needed when the element is connected (parentNode !== null),
    // which is true in connectedCallback but NOT in the constructor.
    const ancestorWrap = collectAncestorContextWrap(element)

    if (ancestorWrap) {
        let resolved: any = undefined
        ancestorWrap(() => {
            resolved = context(symbol)
        })
        if (resolved !== undefined) {
            const isObs = isObservable(resolved)
            if (isObs) return resolved()
            return resolved
        }
    }

    // No provider found — return default value
    return defaultValue
}
