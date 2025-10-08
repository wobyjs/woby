/**
 * Custom Element Implementation for Woby Framework
 * 
 * This module provides functionality to create custom HTML elements with reactive properties
 * that integrate seamlessly with the Woby framework's observable system.
 * 
 * @module customElement
 */

import { isObservable } from "./soby"
import { SYMBOL_JSX, SYMBOL_DEFAULT } from '../constants'
import { setChild, setProp } from "../utils/setters"
import { createElement } from "./create_element"
import { FragmentUtils } from "../utils/fragment"
import { Observable, Stack, SYMBOL_OBSERVABLE_WRITABLE } from "soby"
import type { ObservableOptions } from "soby"
import { isObject } from "../utils"


/**
 * ElementAttributes type helper
 * 
 * Simplified type to prevent excessive type instantiation depth when working with custom elements.
 * Combines HTML attributes with component-specific props.
 * 
 * @template T - Component function type
 */
export type ElementAttributes<T extends (...args: any) => any> =
    T extends (props: infer P) => any
    ? JSX.HTMLAttributes<HTMLElement> & P
    : JSX.HTMLAttributes<HTMLElement>

/**
 * ElementAttributePattern type
 * 
 * Defines the pattern for allowed attributes in custom elements.
 * Supports wildcards, style properties, and component-specific props.
 * 
 * @template P - Component props type
 */
type ElementAttributePattern<P> =
    | (keyof P extends string ? keyof P : never)
    | (keyof JSX.HTMLAttributes<HTMLElement> extends string ? keyof JSX.HTMLAttributes<HTMLElement> : never)
    | '*'
    | `style-${keyof JSX.StyleProperties extends string ? keyof JSX.StyleProperties : never}`
    | `style-*`

/**
 * Converts kebab-case strings to camelCase
 * 
 * Utility function to convert CSS-style property names to JavaScript-style property names.
 * For example: 'font-size' becomes 'fontSize'
 * 
 * @param str - The kebab-case string to convert
 * @returns The camelCase version of the input string
 */
const kebabToCamelCase = (str: string): string => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

/**
 * Sets observable values with appropriate type conversion
 * 
 * Handles setting values on observables without automatic type conversion.
 * All casting must be done manually in the component function since HTML attributes are strings only.
 * 
 * @param obj - The object containing the property to set
 * @param key - The property key to set
 * @param value - The string value to set on the property
 */
const setObservableValue = (obj: any, key: string, value: string) => {
    if (isObservable(obj[key])) {
        // Cast value according to observable options type
        const observable = obj[key] as Observable<any>
        const options = (observable[SYMBOL_OBSERVABLE_WRITABLE]).options as ObservableOptions<any> | undefined

        if (options?.type) {
            switch (options.type) {
                case 'number':
                    obj[key](Number(value))
                    break
                case 'boolean':
                    // Handle various boolean representations
                    const lowerValue = value?.toLowerCase()
                    obj[key](lowerValue === 'true' || lowerValue === '1' || lowerValue === '')
                    break
                case 'bigint':
                    try {
                        obj[key](BigInt(value))
                    } catch (e) {
                        // If parsing fails, fallback to string
                        obj[key](value)
                    }
                    break
                case 'object':
                    try {
                        obj[key](JSON.parse(value))
                    } catch (e) {
                        // If parsing fails, fallback to string
                        obj[key](value)
                    }
                    break
                case 'function':
                    // For function types, we can't really convert from string
                    // This would typically be handled by the component itself
                    obj[key](value)
                    break
                case 'symbol':
                    // For symbol types, create a symbol from the string
                    obj[key](Symbol(value))
                    break
                case 'undefined':
                    obj[key](undefined)
                    break
                default:
                    // For constructor types or other custom types, treat as string
                    // since HTML attributes are always strings and we can't instantiate
                    // arbitrary constructors from strings
                    obj[key](value)
                    break
            }
        } else {
            obj[key](value)
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
 * @param path - The property path (e.g., 'style-font-size' or 'nested-prop-value')
 * @param value - The value to set
 */
const setNestedProperty = (obj: HTMLElement, path: string, value: any) => {
    // For style properties, handle them specially
    if (path.startsWith('style-')) {
        const styleProperty = kebabToCamelCase(path.slice(6)) // Remove 'style-' prefix and convert to camelCase
        if (obj.style) {
            obj.style[styleProperty as any] = value
        }
        return
    }

    // For other properties with dashes, create nested structure
    if (path.includes('-')) {
        const keys = path.split('-')
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

    // For simple properties, set them using the observable value setter
    setObservableValue((obj as any), path, value)
}

/**
 * Gets nested properties from an element
 * 
 * Retrieves values from nested property paths, handling style properties and nested objects.
 * Style properties are converted from kebab-case to camelCase when accessing.
 * 
 * @param obj - The object to get properties from
 * @param path - The property path (e.g., 'style-font-size' or 'nested-prop-value')
 * @returns The value at the specified path, or undefined if not found
 */
const getNestedProperty = (obj: any, path: string) => {
    // For style properties, handle them specially
    if (path.startsWith('style-')) {
        const styleProperty = kebabToCamelCase(path.slice(6)) // Remove 'style-' prefix and convert to camelCase
        if (obj.style) {
            return obj.style[styleProperty as any]
        }
        return undefined
    }

    // For other properties with dashes, navigate nested structure
    if (path.includes('-')) {
        const keys = path.split('-')
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

    // For simple properties, get them directly
    return (obj as any)[path]
}

const isPureFunction = (fn: Function) => typeof fn === 'function' && !isObservable(fn)

/**
 * Creates a custom HTML element with reactive properties
 * 
 * Defines a custom element that integrates with the Woby framework's observable system.
 * The element can observe attribute changes and update corresponding props automatically.
 * 
 * @template P - Component props type
 * @param tagName - The HTML tag name for the custom element
 * @param children - The component function that renders the element's content
 * @returns The custom element class
 * 
 * @example
 * ```tsx
 * const Counter = ({ value }: { value: Observable<number> }) => (
 *   <div>
 *     <p>{value}</p>
 *   </div>
 * )
 * 
 * customElement('counter-element', Counter)
 * 
 * // Usage in JSX:
 * // <counter-element value={$(0)} style-color="red"></counter-element>
 * ```
 */
export const customElement = <P extends { children?: Observable<JSX.Child> }>(tagName: string, children: JSX.Component<P>) => {
    const defaultPropsFn = (children as any)[SYMBOL_DEFAULT]
    if (!defaultPropsFn) {
        console.error(`Component ${tagName} is missing default props. Please use the 'defaults' helper function to provide default props.`)
    }

    /**
     * Custom Element Class
     * 
     * Extends HTMLElement to create a custom element with reactive properties.
     */
    const C = class extends HTMLElement {
        /** Reference to the children component function */
        //rename it to function component
        static __children__ = children;

        //obaserable attributes is deps on props
        static observedAttributes: string[] = []

        /** Component props */
        public props: P
        public propDict: Record<string, string>
        childs: Node[] = []

        constructor(props?: P) {
            super()
            this.props = !!props ? props : defaultPropsFn() || {} as P
            C.observedAttributes = Object.keys(this.props)

            if (!this.props[SYMBOL_JSX]) //html creation of my-component, html to down, woby bottom up
            {
                this.childs = [...(this.childNodes as any)]
                this.replaceChildren() //clear the children
            }
            setChild(this, () => createElement(children, this.props), FragmentUtils.make(), new Stack("customElement"))

            // Temporary MutationObserver to monitor children removal
            const tempObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        if (mutation.removedNodes.length > 0) {
                            console.log('Children removed from custom element:', mutation.removedNodes, mutation.target)
                        }
                    }
                })
            })

            tempObserver.observe(this, { childList: true })
        }

        /**
         * Called when the element is added to the document
         * 
         * Sets up attribute observation and initializes the element.
         */
        connectedCallback() {
            const { observedAttributes } = C
            const { props } = this
            const aKeys = observedAttributes.filter(attrName => !isPureFunction(props[attrName]) && !isObject(props[attrName]))
            const rKeys = observedAttributes.filter(attrName => isPureFunction(props[attrName]))

            // this.attributes not in constructor, so do it here.
            if (!props[SYMBOL_JSX]) {
                // props -> attr
                aKeys.forEach(k => !this.hasAttribute(k) /* && !isObject($$(props[k]))  */ && setProp(this, k, props[k], new Stack()))

                //this.append(...(this.childs as any))
                if (!!this.childs.length)
                    this.props.children(this.childs)
            }
            else {
                debugger
            }

            rKeys.forEach(k => this.removeAttribute(k))

            // attr -> props (1st)
            for (const attr of this.attributes as any)
                this.attributeChangedCallback1(attr.name, undefined, attr.value)

            const observer = new MutationObserver(mutations => {
                mutations.forEach(m => {
                    if (m.type === 'attributes') {
                        const name = m.attributeName
                        const newValue = this.getAttribute(name)
                        const oldValue = m.oldValue
                        // attr -> props (on change)
                        this.attributeChangedCallback1(name, oldValue, newValue)
                    }
                })
            })

            observer.observe(this, { attributes: true, attributeOldValue: true })
        }

        /**
         * Called when an observed attribute changes
         * 
         * Updates the corresponding prop and handles nested properties.
         * 
         * @param name - The name of the changed attribute
         * @param oldValue - The previous value of the attribute
         * @param newValue - The new value of the attribute
         */
        attributeChangedCallback1(name, oldValue, newValue) {
            if (oldValue === newValue) return
            const { props } = this

            if (!this.propDict) {
                this.propDict = {}

                Object.keys(props).forEach((k) => {
                    this.propDict[k.toLowerCase()] = k
                })
            }

            // if (!matchesWildcard(name, C.observedAttributes)) return

            // Check if this is a nested property (contains dashes)
            if (name.includes('-')) {
                // Handle nested properties
                setNestedProperty(this, name, newValue)

                // Also update any observable in the nested path
                setObservableValue(props, this.propDict[name], newValue)
            } else {
                // Handle flat properties (existing behavior)
                const val = props[name]
                setObservableValue(this.props, this.propDict[name], newValue)
            }
        }
    }

    const ec = customElements.get(tagName)
    if (!!ec)
        console.warn(`Element ${tagName} already exists. (ignore this in dev env), use ec.__children__ to find target component`)
    else
        customElements.define(tagName, C)

    return C
}