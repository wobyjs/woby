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

import { $$, isObservable } from "./soby"
import { SYMBOL_DEFAULT, SYMBOL_JSX } from '../constants'
import { setChild, setProp, } from "../utils/setters"
import { createElement } from "./create_element"
import { FragmentUtils } from "../utils/fragment"
import { callStack, isObservableWritable, Observable, SYMBOL_OBSERVABLE_WRITABLE, SYMBOL_UNTRACKED_UNWRAPPED } from "soby"
import type { ObservableOptions } from "soby"
import { isObject, isPureFunction } from "../utils"
import { useEffect } from "../hooks"
import { isJsx } from "../jsx-runtime"
import { camelToKebabCase, kebabToCamelCase } from "../utils/string"
import { normalizePropertyPath } from "../utils/nested"
// Import stylesheet utilities
import { observeStylesheetChanges, refreshStylesheetCache, registerShadowRoot, unregisterShadowRoot } from "../utils/stylesheets"
import { Child, Component, ContextProvider } from "../types"
import { customElements as ces, SSRCustomElement, SSRShadowRoot, SSRSlotElement } from '../ssr/custom_elements'
import { SYMBOL_CONTEXT, SYMBOL_ISSLOT, SYMBOL_CONTEXT_WRAP } from '../constants'
import { context } from '../soby'
import { WobyCustomElementsRegistry, wobyCustomElements } from './custom_element_registry'
import { resolveContextRef, isContextRef } from './context_ref'
export { WobyCustomElementsRegistry, wobyCustomElements }


// if (isSSR) {
//     globalThis.customElements = ces as any
//     globalThis.document = doc as any
//         // Export the SSRCustomElement class for direct use
//         ; (globalThis as any).SSRCustomElement = SSRCustomElement
//         ; (globalThis as any).SSRShadowRoot = SSRShadowRoot
//         ; (globalThis as any).SSRSlotElement = SSRSlotElement
// }

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
export const createSSRCustomElement = <P extends { children?: Observable<Child> }>(
    tagName: string,
    component: Component<P> | ContextProvider<any>
): void => {
    // Create a subclass of SSRCustomElement for this specific component
    class ComponentCustomElement extends SSRCustomElement {
        static __component__ = component

        constructor(props?: P) {
            super(tagName, props)

            // Get the component function
            const componentFn = (this.constructor as any).__component__

            // Always create shadow root for custom elements to encapsulate styling
            const shadowRoot = this.attachShadow({ mode: 'open', serializable: true })

            // Execute the component once and set the result directly in shadow DOM
            if (componentFn && typeof componentFn === 'function') {
                try {
                    const componentResult = componentFn.call(null, this.props)

                    // Store component result ONLY in shadow root childNodes
                    // This will be rendered as the shadow DOM content
                    shadowRoot.childNodes.push(componentResult)

                } catch (e: any) {
                    // Error handling
                }
            }

            // Clear childNodes since everything is now in shadow DOM
            // This prevents duplication in outerHTML
            this.childNodes = []
        }
    }

    // Register the component in our dictionary
    ces.define(tagName, ComponentCustomElement as any)
}

/**
 * Module-level side-channel: a component may call setPendingContextWrap(fn)
 * synchronously during its render to hand its context-wrap to the
 * createBrowserCustomElement constructor, which picks it up via
 * consumePendingContextWrap() right after createElement() returns.
 * This solves the timing gap where ref-based SYMBOL_CONTEXT_WRAP assignment
 * fires as a microtask (too late for sibling / descendant CE constructors).
 */
let _pendingContextWrapGlobal: ((fn: () => void) => void) | undefined

export const setPendingContextWrap = (wrap: (fn: () => void) => void): void => {
    _pendingContextWrapGlobal = wrap
}

export const consumePendingContextWrap = (): ((fn: () => void) => void) | undefined => {
    const w = _pendingContextWrapGlobal
    _pendingContextWrapGlobal = undefined
    return w
}

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
export const composePendingContextWrap = (selfWrap: (fn: () => void) => void): void => {
    const prev = _pendingContextWrapGlobal
    _pendingContextWrapGlobal = prev ? (fn: () => void) => prev(() => selfWrap(fn)) : selfWrap
}

/**
 * Traverses DOM ancestors (crossing shadow boundaries via assignedSlot/host)
 * and collects SYMBOL_CONTEXT_WRAP functions stored by provider custom elements,
 * returning a composed wrap function that re-establishes the full soby context chain.
 */
const collectAncestorContextWrap = (el: HTMLElement): ((fn: () => void) => void) | undefined => {
    const wraps: ((fn: () => void) => void)[] = []
    let cur: any = el.parentNode
    while (cur) {
        const w = cur[SYMBOL_CONTEXT_WRAP]
        if (w) {
            wraps.unshift(w)
        }
        cur = cur.assignedSlot ?? cur.parentNode ?? cur.host ?? null
    }
    if (!wraps.length) return undefined
    return (fn: () => void) => {
        const run = wraps.reduceRight((inner: () => void, wrap) => () => wrap(inner), fn)
        run()
    }
}

/**
 * Creates a browser custom element with reactive properties
 * 
 * @param tagName - The HTML tag name for the custom element
 * @param component - The component function that renders the element's content (can be a regular component or Context.Provider)
 */
export const createBrowserCustomElement = <P extends { children?: Observable<JSX.Child> }>(
    tagName: string,
    component: JSX.Component<P> | ContextProvider<any>
): void => {
    const defaultPropsFn = (component as any)[SYMBOL_DEFAULT]
    if (!defaultPropsFn) {
        console.error(`Component ${tagName} is missing default props.`)
    }

    const C = class extends HTMLElement {
        static __component__ = component;
        static observedAttributes: string[] = []
        public props: P
        public propDict: Record<string, string>
        childs: Node[] = []
        public slots: HTMLSlotElement
        public placeHolder: Comment
        private _attrObserver: MutationObserver | null = null

        constructor(props?: P) {
            super()

            // Always call defaultPropsFn() to create the default observables.
            // When JSX provides props, merge the JSX values into the default observables
            // instead of using JSX props directly. This ensures defaults() detects
            // isJsxProp and skips re-creating defaults on every render.
            const defaultProps = defaultPropsFn() || {} as P
            if (props && isJsx(props)) {
                // Merge JSX-provided values into the default observables.
                //
                // CRITICAL: soby's writable observable treats a *function* argument as a
                // functional updater (callable.js writableFunction -> this.update(fn) ->
                // fn(currentValue)). So calling `defaultObs(incoming)` when `incoming` is
                // itself an observable (or any function) INVOKES `incoming` with the
                // default observable's current value, corrupting the incoming value.
                // In the HTML->JSX provider handoff this wiped the parent custom element's
                // slot/children observable to `undefined`, so context-provider read
                // `$$(children) === undefined` during render and crashed at
                // `Object.assign(context(...), { symbol })`.
                //
                // To merge safely: snapshot observable values via $$ before setting, and
                // store plain functions through an updater so they become the value rather
                // than mutate the source. Plain (non-function) values pass straight through
                // exactly as before, so previously-working props are unaffected.
                const mergeInto = (key: string, incoming: any) => {
                    const obs = defaultProps[key] as Observable<any>
                    if (isObservable(incoming)) obs($$(incoming))
                    else if (typeof incoming === 'function') obs(() => incoming)
                    // A JSX attribute written as a string literal (e.g. count="100") arrives
                    // as a raw string even when the target observable is typed (HtmlNumber /
                    // HtmlBoolean / …). Setting the string straight into a typed observable
                    // makes soby throw "Expected value of type 'number', but received 'string'".
                    // Route strings through setObservableValue so the observable's own type
                    // converter (fromHtml / Number / BigInt / …) runs — exactly like the raw
                    // HTML-attribute sync path does. Untyped observables just receive the string.
                    else if (typeof incoming === 'string') setObservableValue(defaultProps, key, incoming, this)
                    else obs(incoming)
                }
                for (const key in props) {
                    if (key === 'children') continue
                    if (key in defaultProps && isObservableWritable(defaultProps[key])) {
                        mergeInto(key, (props as any)[key])
                    }
                }
                // Populate the children observable from JSX props when it is writable.
                // Provider-style components (e.g. context-provider) read $$(children)
                // synchronously while rendering, so the slot/children must be available
                // BEFORE the component runs. Deferring to createElement's post-construction
                // setChild is too late and leaves children undefined during the initial
                // render (which makes resolve($$(children)) return undefined and crashes
                // callers like context-provider's Object.assign(context(...), ...)).
                if ('children' in props && isObservableWritable(defaultProps['children'])) {
                    mergeInto('children', (props as any).children)
                }
                ;(defaultProps as any)[SYMBOL_JSX] = true
                this.props = defaultProps
            } else {
                this.props = !!props ? props : defaultProps
            }

            if (!isJsx(this.props)) {

                // CRITICAL: Sync attributes from HTML to observables before rendering.
                // This ensures that when custom elements are created via raw HTML parsing,
                // the attributes are available to reactive expressions during the initial render.
                // Without this, the constructor uses default values and attributes are only synced
                // later in connectedCallback, causing a timing mismatch where some expressions
                // evaluate with stale default values.
                if (this.attributes) {
                    for (const attr of this.attributes as any) {
                        const propName = kebabToCamelCase(attr.name)
                        setObservableValue(this.props, propName, attr.value, this)
                    }
                }

                // Check if we're inside a Canvas3D or other context provider
                // by looking for SYMBOL_CONTEXT_WRAP on ancestors BEFORE creating shadow DOM
                const ancestorWrap = collectAncestorContextWrap(this)

                // For Three.js custom elements (tags starting with 'three-'), don't create shadow DOM
                // so they can access the ThreeContext from Canvas3D
                const isThreeElement = tagName.startsWith('three-')
                const shadowRoot = !isThreeElement ? this.attachShadow({ mode: 'open', serializable: true }) : null

                if (!isThreeElement && !($$(this.props.children) instanceof HTMLSlotElement)) {
                    this.slots = document.createElement('slot')

                    const { Provider, value } = this.props[SYMBOL_CONTEXT] ?? {}
                    useEffect(() => { })
                    this.slots[SYMBOL_CONTEXT] = (this.props as any).value

                    this.props.children[SYMBOL_ISSLOT] = true
                    this.props.children(this.slots)
                }
                const ignoreStyle = (this.props as any).ignoreStyle === true
                if (!ignoreStyle) {
                    // Force refresh the cache to ensure we get the latest styles
                    // This is important for dynamically loaded stylesheets like Tailwind CDN
                    const allSheets = refreshStylesheetCache()

                    // Use adopted stylesheets (modern approach per Tailwind CSS v4 Shadow DOM guide)
                    // https://meefik.dev/2025/03/19/tailwindcss-and-shadow-dom/
                    shadowRoot.adoptedStyleSheets = allSheets

                    // Register this shadow root for automatic style updates via MutationObserver
                    registerShadowRoot(shadowRoot)
                }

                // Execute the component once and set the result directly, avoiding reactive re-execution

                const ps = this.props as any as { symbol: symbol, value: any }
                if (SYMBOL_CONTEXT in this.props) {
                    // The `symbol` prop is run through defaults()/make(), which wraps the
                    // raw Symbol in an observable ($()). useContext(), however, looks the
                    // context value up by the RAW symbol stored in CONTEXTS_DATA. So we must
                    // unwrap ps.symbol with $$ before using it as the soby context key — using
                    // the observable directly stringifies the function into a bogus key and
                    // the reader never finds the value.
                    const sym = $$(ps.symbol) as symbol
                    // Store a context-replay function on this element so descendant custom
                    // elements can re-establish the soby context chain.
                    const selfWrap = (fn: () => void) => context({ [sym]: ps.value }, fn);
                    (this as any)[SYMBOL_CONTEXT_WRAP] = selfWrap

                    context({ [sym]: ps.value }, () => {
                        // Clear stale pending wrap; selfWrap above is our baseline and is
                        // only overridden below if THIS render sets a fresh composed wrap.
                        consumePendingContextWrap()
                        const componentResult = createElement(component as any, this.props)
                        if (typeof componentResult === 'function') {
                            let resolved = componentResult()
                            let depth = 0
                            while (typeof resolved === 'function' && depth < 10) {
                                const next = resolved()
                                depth++
                                resolved = next
                            }
                        }
                        if (shadowRoot) {
                            setChild(shadowRoot, componentResult, FragmentUtils.make(), callStack('Custom element'))
                        } else {
                            setChild(this, componentResult, FragmentUtils.make(), callStack('Custom element'))
                        }
                        // After setChild invokes the component, capture any pending context wrap.
                        const pendingWrap = consumePendingContextWrap()
                        if (pendingWrap) (this as any)[SYMBOL_CONTEXT_WRAP] = pendingWrap
                    })
                }
                else {
                    // Render the component, then capture any pending context wrap it set.
                    const renderInto = (wrapFn?: (fn: () => void) => void) => {
                        const doRender = () => {
                            // Clear any stale pending wrap so we only capture wraps set by
                            // THIS element's own internal JSX providers during the render
                            // below — not one leaked from an ancestor/sibling provider.
                            // This is what keeps soby's normal JSX context path isolated:
                            // an unrelated custom element never inherits a dangling wrap.
                            consumePendingContextWrap()
                            const componentResult = createElement(component as any, this.props)
                            if (typeof componentResult === 'function') {
                                let resolved = componentResult()
                                let depth = 0
                                while (typeof resolved === 'function' && depth < 10) {
                                    const next = resolved()
                                    depth++
                                    resolved = next
                                }
                            }
                            if (shadowRoot) {
                                setChild(shadowRoot, componentResult, FragmentUtils.make(), callStack('Custom element'))
                            } else {
                                setChild(this, componentResult, FragmentUtils.make(), callStack('Custom element'))
                            }
                            // After setChild (which actually invokes the component via wrapElement),
                            // capture any pending context wrap set synchronously during component render.
                            const pendingWrap = consumePendingContextWrap()
                            if (pendingWrap) (this as any)[SYMBOL_CONTEXT_WRAP] = pendingWrap
                        }
                        wrapFn ? wrapFn(doRender) : doRender()
                    }

                    if (ancestorWrap) {
                        renderInto(ancestorWrap)
                    } else {
                        renderInto()
                    }
                }
            } else {
                setChild(this, createElement(component as any, this.props), FragmentUtils.make(), callStack('Custom element'))
            }

            if (!this.propDict) {
                this.propDict = {}
                Object.keys(this.props).forEach((k) => {
                    const c = camelToKebabCase(k)
                    this.propDict[c] = k
                    this.propDict[k] = c
                })
            }
        }

        connectedCallback() {
            // Disconnect any existing observer before creating a new one (handles re-entry)
            if (this._attrObserver) {
                this._attrObserver.disconnect()
            }

            const { observedAttributes } = C
            const { props: p } = this
            const aKeys = Object.keys(p).filter(k => k !== 'children' && isObservable(p[k]))
            const rKeys = Object.keys(p).filter(k => isPureFunction(p[k]) || isObject(p[k]))

            rKeys.forEach(k => this.removeAttribute(k))

            for (const k of aKeys as any) {
                // When isJsx, skip complex object props that would stringify to [object Object]
                // and cannot be meaningfully converted back from an HTML attribute.
                // Only set primitive-typed observable values as HTML attributes.
                if (isJsx(p)) {
                    const val = $$(p[k])
                    if (isObject(val) && !(val instanceof Date)) continue
                }
                // Only reflect the observable value onto the host attribute when the
                // attribute is ABSENT (i.e. populate defaults for props the author did
                // not write). In JSX mode createElement's setProps already wrote every
                // authored attribute as the original string (e.g. active="true"); forcing
                // reflection here re-derives it from the typed observable and LOSES
                // information — HtmlBoolean.toHtml(true) === '' would clobber active="true"
                // into active="". Reactive observable props keep their binding via the
                // setProps call in createElement, so skipping present attributes is safe.
                if (!this.attributes[this.propDict[k]])
                    setProp(this, this.propDict[k], p[k], callStack('connectedCallback'))
            }

            for (const attr of this.attributes as any) {
                this.attributeChangedCallback1(attr.name, undefined, attr.value)
            }

            this._attrObserver?.disconnect()
            this._attrObserver = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    if (m.type === 'attributes') {
                        const name = m.attributeName
                        const newValue = this.getAttribute(name)
                        const oldValue = m.oldValue
                        this.attributeChangedCallback1(name, oldValue, newValue)
                    }
                })
            })

            this._attrObserver.observe(this, { attributes: true, attributeOldValue: true })
        }

        disconnectedCallback() {
            if (this._attrObserver) {
                this._attrObserver.disconnect()
                this._attrObserver = null
            }
            if (this.shadowRoot) {
                unregisterShadowRoot(this.shadowRoot)
            }
        }

        attributeChangedCallback1(name, oldValue, newValue) {
            if (oldValue === newValue) return
            if (newValue === '[object Object]') return

            const { props } = this
            const propName = kebabToCamelCase(name)

            // If the attribute is an @-prefixed context reference, skip re-processing
            // in attributeChangedCallback. The JSX constructor path (mergeInto) already
            // resolved it synchronously inside the provider's context scope. Re-processing
            // here would happen outside that scope and return a default/fallback value,
            // overwriting the correct resolved value.
            if (isContextRef(newValue)) return

            // Guard: if the observable already holds a non-primitive value (object/function),
            // don't overwrite it with a stringified attribute. This protects complex objects
            // passed via JSX props from being clobbered by HTML attribute sync.
            if (isObservable(props[propName])) {
                const currentVal = $$(props[propName])
                if (isObject(currentVal) && !(currentVal instanceof Date) && typeof newValue === 'string') return
            }

            if (name.includes('$') || name.includes('.')) {
                const normalizedPath = normalizePropertyPath(name)
                setNestedProperty(this, normalizedPath, newValue)
                const propName = kebabToCamelCase(name.replace(/\$/g, '.').replace(/\./g, '.'))
                setObservableValue(props, propName, newValue, this)
            } else {
                const propName = kebabToCamelCase(name)
                setObservableValue(this.props, propName, newValue, this)
            }
        }
    }

    // Use the woby-scoped registry rather than the raw global customElements.
    // This prevents name collisions with other libraries (react, lit, etc.) that
    // also call customElements.define(), while still registering a native
    // dispatcher so the browser can upgrade matching HTML elements.
    if (wobyCustomElements.has(tagName)) {
        console.warn(`[Woby] Element ${tagName} already registered in woby registry.`)
    } else {
        wobyCustomElements.define(tagName, C)
    }
}

/**
 * ElementAttributes type helper
 * 
 * Simplified type to prevent excessive type instantiation depth when working with custom elements.
 * Combines HTML attributes with component-specific props.
 * 
 * @template T - Component function type
 */
export type ElementAttributesPattern<P> =
    | (keyof P extends string ? keyof P : never)
    | (keyof JSX.HTMLAttributes<HTMLElement> extends string ? keyof JSX.HTMLAttributes<HTMLElement> : never)
    | `style.${keyof JSX.StyleProperties extends string ? keyof JSX.StyleProperties : never}`
    | `style$${keyof JSX.StyleProperties extends string ? keyof JSX.StyleProperties : never}`

export type ExtractProps<T> = T extends (props: infer P) => any ? P : never

export type ElementAttributes1<T extends (...args: any) => any> =
    // {} | { children?: JSX.Child } | 
    (T extends (props: infer P) => any
        ? Partial<(JSX.HTMLAttributes<HTMLElement> & ElementAttributesPattern<P>)>
        : Partial<JSX.HTMLAttributes<HTMLElement>>)

export type ElementAttributes<T extends (...args: any) => any> =
    Partial<JSX.HTMLAttributes<HTMLElement>> &
    Partial<Record<ElementAttributesPattern<ExtractProps<T>>, any>>

// export type ElementAttributes<T extends (props: P) => any, P> =
//     Partial<(JSX.HTMLAttributes<HTMLElement> & ElementAttributesPattern<P>)>

// Initialize stylesheet observation at module level (run once)
// This ensures we only have one observer watching for stylesheet changes
// but each custom element can get the latest cached stylesheets
// Only initialize in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    observeStylesheetChanges()
}

/**
 * ElementAttributePattern type
 * 
 * Defines the pattern for allowed attributes in custom elements.
 * Supports wildcards, style properties, and component-specific props.
 * In HTML, use dot notation (e.g., style.color, nested.prop.value)
 * In JSX, use dash notation (e.g., style-color, nested-prop-value)
 * All kebab-case attribute names are automatically converted to camelCase property names.
 * 
 * @template P - Component props type
 */
type ElementAttributePattern<P> =
    | (keyof P extends string ? keyof P : never)
    | (keyof JSX.HTMLAttributes<HTMLElement> extends string ? keyof JSX.HTMLAttributes<HTMLElement> : never)
    | '*'
    | `style.${keyof JSX.StyleProperties extends string ? keyof JSX.StyleProperties : never}`
    | `style.*`

/**
 * Sets observable values with appropriate type conversion
 * 
 * Handles setting values on observables without automatic type conversion.
 * All casting must be done manually in the component function since HTML attributes are strings only.
 * 
 * Supports custom serialization using toHtml and fromHtml options:
 * - toHtml: Function to convert observable value to string for HTML attributes
 * - fromHtml: Function to convert string from HTML attributes back to observable value
 * 
 * To hide a property from HTML attributes, use { toHtml: () => undefined }
 * 
 * @param obj - The object containing the property to set
* @param key - The property key to set
* @param value - The string value to set on the property
*/
const setObservableValue = (obj: any, key: string, value: string, element?: Element) => {
    // @-prefix context reference resolution
    if (typeof value === 'string') {
        if (value.startsWith('@@')) {
            value = value.slice(1)  // escape: "@@literal" → "@literal"
        } else if (isContextRef(value)) {
            if (isObservable(obj[key]) && isObservableWritable(obj[key])) {
                const resolved = resolveContextRef(value, element)
                if (resolved !== undefined) {
                    obj[key](resolved)
                    return
                }
            }
        }
    }

    if (isObservable(obj[key])) {
        if (!isObservableWritable(obj[key])) return
        // Cast value according to observable options type
        const observable = obj[key] as Observable<any>
        const options = (observable[SYMBOL_OBSERVABLE_WRITABLE]).options as ObservableOptions<any> | undefined
        const { type, fromHtml } = options ?? {}
        if (type) {
            switch (type) {
                case 'number':
                    obj[key](fromHtml ? fromHtml(value) : Number(value))
                    break
                case 'boolean':
                    // Handle various boolean representations
                    if (fromHtml) {
                        obj[key](fromHtml(value))
                    } else {
                        const lowerValue = value?.toLowerCase()
                        obj[key](lowerValue === 'true' || lowerValue === '1' || lowerValue === '')
                    }
                    break
                case 'bigint':
                    if (fromHtml) {
                        obj[key](fromHtml(value))
                    } else {
                        try {
                            obj[key](BigInt(value))
                        } catch (e) {
                            // If parsing fails, fallback to string
                            obj[key](value)
                        }
                    }
                    break
                case 'object':
                    if (fromHtml) {
                        obj[key](fromHtml(value))
                    } else {
                        try {
                            obj[key](JSON.parse(value))
                        } catch (e) {
                            // If parsing fails, fallback to string
                            obj[key](value)
                        }
                    }
                    break
                case 'function':
                    // For function types, we can't really convert from string
                    // This would typically be handled by the component itself
                    obj[key](fromHtml ? fromHtml(value) : value)
                    break
                case 'symbol':
                    // For symbol types, create a symbol from the string
                    obj[key](fromHtml ? fromHtml(value) : Symbol(value))
                    break
                case 'undefined':
                    obj[key](fromHtml ? fromHtml(value) : undefined)
                    break
                default:
                    // For constructor types or other custom types, treat as string
                    // since HTML attributes are always strings and we can't instantiate
                    // arbitrary constructors from strings
                    obj[key](fromHtml ? fromHtml(value) : value)
                    break
            }
        } else {
            obj[key](fromHtml ? fromHtml(value) : value)
        }
    } else {
        obj[key] = value
    }
}

/**
 * Sets nested properties on an element
 * 
 * Handles setting properties that may be nested objects or style properties.
 * Style properties are converted from kebab-case to camelCase and set on the element's style.
 * Nested properties are created in the element's props object.
 * 
 * @param obj - The HTMLElement to set properties on
 * @param path - The property path (e.g., 'style.font-size' or 'nested.prop.value')
 * @param value - The value to set
 */
const setNestedProperty = (obj: HTMLElement, path: string, value: any) => {
    // For style properties, handle them specially
    if (path.startsWith('style.')) {
        const styleProperty = kebabToCamelCase(path.slice(6)) // Remove 'style.' prefix and convert to camelCase
        if (obj.style) {
            obj.style[styleProperty as any] = value
        }
        return
    }

    // For other properties with dots, create nested structure
    if (path.includes('.')) {
        const keys = path.split('.').map(key => kebabToCamelCase(key)) // Convert all keys to camelCase
        const lastKey = keys.pop()

        // Navigate to the nested object
        let target = obj as any
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            // For the first key, try target.props[key] if target[key] doesn't exist
            if (i === 0 && !(key in target)) {
                // Only create in target.props, not directly on target
                if (!target.props) {
                    target.props = {}
                }
                if (!(key in target.props) || typeof target.props[key] !== 'object' || target.props[key] === null) {
                    target.props[key] = {}
                }
                target = target.props[key]
            } else if (!(key in target) || typeof target[key] !== 'object' || target[key] === null) {
                target[key] = {}
                target = target[key]
            } else {
                target = target[key]
            }
        }

        // Set the final property using the observable value setter
        if (lastKey) {
            setObservableValue(target, lastKey, value, obj)
        }
        return
    }

    // For simple properties, convert to camelCase and set them using the observable value setter
    setObservableValue((obj as any), kebabToCamelCase(path), value, obj as Element)
}

/**
 * Gets nested properties from an element
 * 
 * Retrieves values from nested property paths, handling style properties and nested objects.
 * Style properties are converted from kebab-case to camelCase when accessing.
 * 
 * @param obj - The object to get properties from
 * @param path - The property path (e.g., 'style.font-size' or 'nested.prop.value')
 * @returns The value at the specified path, or undefined if not found
 */
const getNestedProperty = (obj: any, path: string) => {
    // For style properties, handle them specially
    if (path.startsWith('style.')) {
        const styleProperty = kebabToCamelCase(path.slice(6)) // Remove 'style.' prefix and convert to camelCase
        if (obj.style) {
            return obj.style[styleProperty as any]
        }
        return undefined
    }

    // For other properties with dots, navigate nested structure
    if (path.includes('.')) {
        const keys = path.split('.').map(key => kebabToCamelCase(key)) // Convert all keys to camelCase
        let target = obj

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            // For the first key, try target.props[key] if target[key] doesn't exist
            if (i === 0 && !(key in target) && target.props && key in target.props) {
                target = target.props[key]
            } else if (!(key in target)) {
                return undefined
            } else {
                target = target[key]
            }
        }

        return target
    }

    // For simple properties, convert to camelCase and get them directly
    return (obj as any)[kebabToCamelCase(path)]
}


// const isLightDom = (node: Node): boolean => {
//     let current: Node | null = node?.parentNode
//     while (current) {
//         if ((current as Element)?.shadowRoot) {
//             return true
//         }
//         current = current.parentNode
//     }
//     return false
// }

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
export const customElement = <P extends { children?: Observable<JSX.Child> }>(tagName: string, component: JSX.Component<P> | ContextProvider<any>): void => {
    // Browser must be registered first so it wins the native slot.
    // SSR is the fallback for environments without a DOM.
    if (globalThis.window && globalThis.document) {
        createBrowserCustomElement(tagName, component)
    } else {
        createSSRCustomElement(tagName, component)
    }
}
