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
import { SYMBOL_DEFAULT } from '../constants'
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
import { convertAllDocumentStylesToConstructed, observeStylesheetChanges } from "../utils/stylesheets"
import { Child, Component, ContextProvider } from "../types"
import { customElements as ces, SSRCustomElement, SSRShadowRoot, SSRSlotElement } from '../ssr/custom_elements'
import { SYMBOL_CONTEXT, SYMBOL_ISSLOT, SYMBOL_CONTEXT_WRAP } from '../constants'
import { context } from '../soby'
import { WobyCustomElementsRegistry, wobyCustomElements } from './custom_element_registry'
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
 * Traverses DOM ancestors (crossing shadow boundaries via assignedSlot/host)
 * and collects SYMBOL_CONTEXT_WRAP functions stored by provider custom elements,
 * returning a composed wrap function that re-establishes the full soby context chain.
 */
const collectAncestorContextWrap = (el: HTMLElement): ((fn: () => void) => void) | undefined => {
    const wraps: ((fn: () => void) => void)[] = []
    let cur: any = el.parentNode
    console.log('[collectAncestorContextWrap] Starting traversal for:', el.tagName, 'initial parentNode:', cur)
    while (cur) {
        const w = cur[SYMBOL_CONTEXT_WRAP]
        if (w) {
            console.log('[collectAncestorContextWrap] Found CONTEXT_WRAP at:', cur.tagName || cur.constructor?.name, 'wraps.length:', wraps.length)
            wraps.unshift(w)
        } else {
            console.log('[collectAncestorContextWrap] No CONTEXT_WRAP at:', cur.tagName || cur.constructor?.name)
        }
        cur = cur.assignedSlot ?? cur.parentNode ?? cur.host ?? null
        if (cur) {
            console.log('[collectAncestorContextWrap] Continuing to:', cur.tagName || cur.constructor?.name)
        }
    }
    console.log('[collectAncestorContextWrap] Final wraps count:', wraps.length, 'for element:', el.tagName)
    if (!wraps.length) return undefined
    return (fn: () => void) => {
        console.log('[collectAncestorContextWrap] Executing wrap with', wraps.length, 'context layers')
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

        constructor(props?: P) {
            super()

            this.props = !!props ? props : defaultPropsFn() || {} as P
            C.observedAttributes = Object.keys(this.props)

            if (!isJsx(this.props)) {

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

                if (!isThreeElement) {
                    const ignoreStyle = (this.props as any).ignoreStyle === true
                    if (!ignoreStyle) {
                        const allSheets = convertAllDocumentStylesToConstructed()
                        shadowRoot.adoptedStyleSheets = allSheets
                    }
                }

                // Execute the component once and set the result directly, avoiding reactive re-execution

                const ps = this.props as any as { symbol: symbol, value: any }
                if (SYMBOL_CONTEXT in this.props) {
                    // Store a context-replay function on this element so descendant custom
                    // elements can re-establish the soby context chain.
                    const selfWrap = (fn: () => void) => context({ [ps.symbol]: ps.value }, fn);
                    (this as any)[SYMBOL_CONTEXT_WRAP] = selfWrap

                    context({ [ps.symbol]: ps.value }, () => {
                        const componentResult = createElement(component as any, this.props)
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
                            const componentResult = createElement(component as any, this.props)
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
            const { observedAttributes } = C
            const { props: p } = this
            const aKeys = Object.keys(p).filter(k => k !== 'children' && isObservable(p[k]))
            const rKeys = Object.keys(p).filter(k => isPureFunction(p[k]) || isObject(p[k]))

            rKeys.forEach(k => this.removeAttribute(k))

            for (const k of aKeys as any)
                if (!this.attributes[this.propDict[k]] || isJsx(p))
                    setProp(this, this.propDict[k], p[k], callStack('connectedCallback'))

            for (const attr of this.attributes as any) {
                this.attributeChangedCallback1(attr.name, undefined, attr.value)
            }

            const observer = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    if (m.type === 'attributes') {
                        const name = m.attributeName
                        const newValue = this.getAttribute(name)
                        const oldValue = m.oldValue
                        this.attributeChangedCallback1(name, oldValue, newValue)
                    }
                })
            })

            observer.observe(this, { attributes: true, attributeOldValue: true })
        }

        disconnectedCallback() { }

        attributeChangedCallback1(name, oldValue, newValue) {
            if (oldValue === newValue) return
            if (newValue === '[object Object]') return

            const { props } = this
            if (name.includes('$') || name.includes('.')) {
                const normalizedPath = normalizePropertyPath(name)
                setNestedProperty(this, normalizedPath, newValue)
                const propName = kebabToCamelCase(name.replace(/\$/g, '.').replace(/\./g, '.'))
                setObservableValue(props, propName, newValue)
            } else {
                const propName = kebabToCamelCase(name)
                setObservableValue(this.props, propName, newValue)
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
const setObservableValue = (obj: any, key: string, value: string) => {
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
            setObservableValue(target, lastKey, value)
        }
        return
    }

    // For simple properties, convert to camelCase and set them using the observable value setter
    setObservableValue((obj as any), kebabToCamelCase(path), value)
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
    createSSRCustomElement(tagName, component)

    if (globalThis.window && globalThis.document) {
        createBrowserCustomElement(tagName, component)
    }
}
