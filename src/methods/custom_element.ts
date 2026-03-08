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

import { $, $$, isObservable } from "./soby"
import { isSSR, SYMBOL_DEFAULT } from '../constants'
import { setChild, setProp, } from "../utils/setters"
import { createElement } from "./create_element"
import { FragmentUtils } from "../utils/fragment"
import { callStack, isObservableWritable, Observable, SYMBOL_OBSERVABLE_WRITABLE } from "soby"
import type { ObservableOptions } from "soby"
import { isObject, isPureFunction } from "../utils"
import { useEffect } from "../hooks"
import { isJsx } from "../jsx-runtime"
import { camelToKebabCase, kebabToCamelCase } from "../utils/string"
import { normalizePropertyPath } from "../utils/nested"
// Import stylesheet utilities
import { convertAllDocumentStylesToConstructed, observeStylesheetChanges } from "../utils/stylesheets"
import { ObservableMaybe, Child, Component } from "../types"
import { useLightDom } from "../hooks/use_attached"
import { mark } from "../utils/mark"
import { customElements as ces } from '../ssr/custom_elements'
import { document as doc } from '../ssr/document'
import { useEnvironment } from "../components"
import { Element } from '../ssr/element'

if (isSSR) {
    globalThis.customElements = ces as any
    globalThis.document = doc as any
}

/**
 * Creates a mock custom element for SSR environments
 *
 * This function creates a mock implementation of a custom element for use in
 * server-side rendering environments where browser APIs are not available.
 *
 * @template P - Component props type
 * @param tagName - The HTML tag name for the custom element
 * @param component - The component function that renders the element's content
 * @returns A mock custom element class
 */
export const createSSRCustomElement = <P extends { children?: Observable<Child> }>(
    tagName: string,
    component: Component<P>
): void => {
    // Create a mock class for SSR that behaves like the browser version
    class SSRCustomElement extends Element {
        static __component__ = component
        public props: P
        public attributes: Record<string, string> = {}
        public childNodes: any[] = []

        constructor(props?: P) {
            super(tagName) // Initialize Element with tagName
                    
            // Get the component function
            const componentFn = (this.constructor as any).__component__
                    
            // Store provided props
            this.props = props || {} as P
        
            // Execute component and render children if component exists
            if (componentFn && typeof componentFn === 'function') {
                try {
                    // Call component with props to get JSX result
                    const jsxResult = componentFn.call(null, this.props)
                            
                    // For SSR, we need to resolve the JSX.Element to actual nodes
                    // The jsxResult is typically a function wrapper (JSX.Element)
                    // We'll store it in childNodes to be resolved later by outerHTML
                    this.childNodes = [jsxResult]
                } catch (e) {
                    console.error('[SSRCustomElement] Failed to execute component:', e)
                    this.childNodes = []
                }
            } else {
                // No component function, just use children from props if available
                if (props && (props as any).children) {
                    const children = (props as any).children
                    this.childNodes = Array.isArray(children) ? children : [children]
                } else {
                    this.childNodes = []
                }
            }
        }

        // Mock methods for SSR
        static get observedAttributes() {
            return []
        }

        // Mock HTMLElement methods needed for SSR
        setAttribute(name: string, value: string) {
            this.attributes[name] = value
        }

        getAttribute(name: string) {
            return this.attributes[name]
        }

        removeAttribute(name: string) {
            delete this.attributes[name]
        }

        // Add outerHTML getter to render the custom element with its children
        get outerHTML() {
            // Build attributes string from this.attributes (already set by setProps)
            const attrs = Object.entries(this.attributes || {})
                .map(([name, value]) => `${name.toLowerCase()}="${value ?? ''}"`)
                .join(' ')
            const attrStr = attrs ? ` ${attrs}` : ''

            // Build children string by resolving and converting each child to HTML
            const children = this.childNodes.map((child: any) => {
                // Resolve function children (JSX.Element wrappers)
                if (typeof child === 'function') {
                    try {
                        let resolved = child()
                        // Keep resolving if result is also a function
                        while (typeof resolved === 'function') {
                            resolved = resolved()
                        }

                        // If resolved child has outerHTML, use it
                        if (resolved && typeof resolved === 'object' && 'outerHTML' in resolved) {
                            return resolved.outerHTML
                        }

                        // If resolved child is an Element/Node, get its content
                        if (resolved && typeof resolved === 'object' && 'nodeType' in resolved) {
                            if (resolved.nodeType === 1 && 'innerHTML' in resolved) {
                                return resolved.innerHTML
                            }
                            if ('textContent' in resolved) {
                                return resolved.textContent
                            }
                        }

                        child = resolved
                    } catch (e) {
                        console.error('[SSRCustomElement.outerHTML] Failed to resolve child:', e)
                        return String(child ?? '')
                    }
                }
                if (typeof child === 'object' && child !== null) {
                    if ('outerHTML' in child) {
                        return child.outerHTML
                    } else if ('textContent' in child) {
                        return child.textContent
                    } else if ('innerHTML' in child) {
                        // For Element objects, return innerHTML for children
                        return child.innerHTML
                    }
                }
                return String(child ?? '')
            }).join('')

            return `<${tagName.toLowerCase()}${attrStr}>${children}</${tagName.toLowerCase()}>`
        }

        connectedCallback() { }
        disconnectedCallback() { }
        attributeChangedCallback() { }
    }

    // Add static properties that the SSR code expects
    (SSRCustomElement as any).__component__ = component

    // Register the component in our dictionary
    ces.define(tagName, SSRCustomElement as any)

    // Removed: return statement - now returns void
}

/**
 * Creates a browser custom element with reactive properties
 */
export const createBrowserCustomElement = <P extends { children?: Observable<JSX.Child> }>(
    tagName: string,
    component: JSX.Component<P>
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
                const shadowRoot = this.attachShadow({ mode: 'open', serializable: true })
                if (!($$(this.props.children) instanceof HTMLSlotElement)) {
                    this.slots = document.createElement('slot')
                    this.props.children(this.slots)
                }

                const ignoreStyle = (this.props as any).ignoreStyle === true
                if (!ignoreStyle) {
                    const allSheets = convertAllDocumentStylesToConstructed()
                    shadowRoot.adoptedStyleSheets = allSheets
                }

                setChild(shadowRoot, createElement(component, this.props), FragmentUtils.make(), callStack('Custom element'))
            } else {
                setChild(this, createElement(component, this.props), FragmentUtils.make(), callStack('Custom element'))
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

            for (const attr of this.attributes as any)
                this.attributeChangedCallback1(attr.name, undefined, attr.value)

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

    const ec = customElements.get(tagName)
    if (!!ec)
        console.warn(`Element ${tagName} already exists.`)
    else
        customElements.define(tagName, C)
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


const isLightDom = (node: Node): boolean => {
    let current: Node | null = node?.parentNode
    while (current) {
        if ((current as Element)?.shadowRoot) {
            return true
        }
        current = current.parentNode
    }
    return false
}

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
 * 
 * @template P - Component props type
 * @param tagName - The HTML tag name for the custom element (must contain a hyphen)
 * @param component - The component function that renders the element's content
 * @returns The custom element class
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
 * // Component with nested properties
 * const UserCard = defaults(() => ({
 *   user: {
 *     name: $('John'),
 *     details: {
 *       age: $(30, { type: 'number' } as const)
 *     }
 *   }
 * }), ({ user }: { user: { name: Observable<string>, details: { age: Observable<number> } } }) => (
 *   <div>
 *     <h2>{user.name}</h2>
 *     <p>Age: {user.details.age}</p>
 *   </div>
 * ))
 * 
 * customElement('user-card', UserCard)
 * 
 * // Usage with nested attributes:
 * // <user-card user$name="Jane" user$details$age="25"></user-card> (both HTML and JSX)
 * ```
 * 
 * @example
 * ```tsx
 * // Component with custom serialization
 * const DateComponent = defaults(() => ({
 *   date: $(new Date(), { 
 *     toHtml: o => o.toISOString(), 
 *     fromHtml: o => new Date(o) 
 *   })
 * }), ({ date }: { date: Observable<Date> }) => (
 *   <div>Date: {() => $$(date).toString()}</div>
 * ))
 * 
 * customElement('date-component', DateComponent)
 * 
 * // Usage:
 * // <date-component date="2023-01-01T00:00:00.000Z"></date-component>
 * ```
 * 
 * @example
 * ```tsx
 * // Component with hidden functions
 * const Counter = defaults(() => {
 *   const value = $(0, { type: 'number' } as const)
 *   return {
 *     value,
 *     increment: $([() => { value($$(value) + 10) }], { toHtml: o => undefined }) // Hide from HTML attributes
 *   }
 * }), ({ value, increment }: { value: Observable<number>, increment: Observable<(() => void)[]> }) => (
 *   <div>
 *     <p>Count: {value}</p>
 *     <button onClick={() => increment[0]()}>+</button>
 *   </div>
 * ))
 * 
 * customElement('counter-element', Counter)
 * ```
 */
export const customElement = <P extends { children?: Observable<JSX.Child> }>(tagName: string, component: JSX.Component<P>): void => {
    createSSRCustomElement(tagName, component)
    if (globalThis.window && globalThis.document)
        createBrowserCustomElement(tagName, component)
}
