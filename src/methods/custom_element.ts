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
import { SYMBOL_DEFAULT } from '../constants'
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
import { ObservableMaybe } from "../types"
import { useLightDom } from "../hooks/use_attached"
import { mark } from "../utils/mark"


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

export const useAttached = (ref?: ObservableMaybe<Node | null>, match?: (parent: Node | null) => boolean) => {
    const isGiven = ref !== undefined

    if (!ref)
        ref = $<Node>()

    const parent = $<Node | null>(null)

    useEffect(() => {
        if (!$$(ref)) return

        const updateParent = () => {
            let currentParent: Node | null = $$(ref).parentNode

            // If match function is provided, traverse up until match or root
            if (match) {
                while (currentParent) {
                    if (match(currentParent)) {
                        parent(currentParent)
                        return
                    }
                    currentParent = currentParent.parentNode
                }
                // If no match found, parent remains null
                parent(null)
            } else {
                // Default behavior: return immediate parent
                parent(currentParent)
            }
        }

        // Initial parent check
        updateParent()

        // Create a MutationObserver to watch for parent changes
        const observer = new MutationObserver(() => {
            updateParent()
        })

        // Start observing the parent element changes
        observer.observe($$(ref).getRootNode() as Node, { subtree: true, childList: true })

        // Cleanup observer on unmount
        return () => observer.disconnect()
    })

    // Return the reference node
    return {
        parent,
        mount: isGiven ? undefined : mark('attach', ref),
        ref
    }
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
export const customElement = <P extends { children?: Observable<JSX.Child> }>(tagName: string, component: JSX.Component<P>) => {
    // Check if we're in an SSR environment
    const isSSR = typeof window === 'undefined' || typeof document === 'undefined';
    
    // For SSR, we just return a simple function that creates a standard HTML element
    if (isSSR) {
        // In SSR mode, we create a function that renders the component as a regular HTML element
        // without shadow DOM or custom element registration
        const ssrComponent = (props?: P) => {
            // Create a standard HTML element
            const element: any = {
                nodeType: 1,
                tagName: tagName.toUpperCase(),
                attributes: {},
                childNodes: [],
                style: {},
                
                // Method to set attributes
                setAttribute: function (name: string, value: any) {
                    this.attributes[name] = String(value);
                },
                
                // Method to append child nodes
                appendChild: function (child: any) {
                    this.childNodes.push(child);
                },
                
                // Getter for outerHTML
                get outerHTML() {
                    // Build attributes string
                    const attrs = Object.entries(this.attributes)
                        .map(([name, value]) => `${name}="${value}"`)
                        .join(' ');
                    const attrStr = attrs ? ` ${attrs}` : '';
                    
                    // Handle self-closing tags
                    if (['br', 'hr', 'img', 'input', 'meta', 'link'].includes(this.tagName.toLowerCase())) {
                        return `<${this.tagName}${attrStr}>`;
                    }
                    
                    // Build children string
                    const children = this.childNodes.map((child: any) => {
                        if (typeof child === 'object' && child !== null) {
                            if ('outerHTML' in child) {
                                return child.outerHTML;
                            } else if ('textContent' in child) {
                                return child.textContent;
                            }
                        }
                        return String(child);
                    }).join('');
                    
                    return `<${this.tagName}${attrStr}>${children}</${this.tagName}>`;
                }
            };
            
            // Set props as attributes
            if (props) {
                Object.keys(props).forEach(key => {
                    if (key !== 'children' && props[key] !== undefined) {
                        // Handle observable values
                        const value = isObservable(props[key]) ? $$(props[key]) : props[key];
                        // Convert to string for HTML attributes
                        element.setAttribute(key, String(value));
                    }
                });
            }
            
            return element;
        };
        
        // Attach the component function for internal use
        (ssrComponent as any).__component__ = component;
        
        return ssrComponent;
    }
    
    const defaultPropsFn = (component as any)[SYMBOL_DEFAULT];
    if (!defaultPropsFn) {
        console.error(`Component ${tagName} is missing default props. Please use the 'defaults' helper function to provide default props.`);
    }

    /**
     * Custom Element Class
     * 
     * Extends HTMLElement to create a custom element with reactive properties.
     */
    const C = class extends HTMLElement {
        /** Reference to the children component function */
        //rename it to function component
        static __component__ = component;

        //obaserable attributes is deps on props
        static observedAttributes: string[] = []

        /** Component props */
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
                    // this.slots.onslotchange = () => {
                    //     console.log('slotchange', this.slots.assignedElements())
                    // }
                    this.props.children(this.slots)
                }

                // console.log('isLightDom', isLightDom(this), [this])
                // if (isLightDom(this)) {
                //     const { lightDom } = useLightDom(this)
                //     useEffect(() => {
                //         console.log('lightDom parent', $$(lightDom), /* ($$(lp) as Element).assignedSlot, */ this, [component])
                //     })
                // }
                // Check if stylesheet encapsulation should be ignored
                const ignoreStyle = (this.props as any).ignoreStyle === true

                // Only adopt stylesheets if not explicitly disabled
                if (!ignoreStyle) {
                    // Get the latest cached stylesheets
                    // The stylesheet observation is initialized once at the module level
                    const allSheets = convertAllDocumentStylesToConstructed()

                    // Adopt all the retrieved stylesheets
                    shadowRoot.adoptedStyleSheets = allSheets
                }

                // this.placeHolder = document.createComment('')
                // shadowRoot.append(this.placeHolder/* , this.slots */)
                // render(createElement(component, this.props), shadowRoot) 

                //creating the child in tsx
                setChild(shadowRoot, createElement(component, this.props), FragmentUtils.make(), callStack('Custom element'))
            }
            else {
                //never happen
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

        /**
         * Called when the element is added to the document
         * 
         * Sets up attribute observation and initializes the element.
         */
        connectedCallback() {
            // ------------ not working for <my-comp> in TSX files------------
            const { observedAttributes } = C
            const { props: p } = this
            const aKeys = Object.keys(p).filter(k => /* !isPureFunction(p[k]) && !isObject(p[k]) && */ k !== 'children' && isObservable(p[k]))
            const rKeys = Object.keys(p).filter(k => isPureFunction(p[k]) || isObject(p[k]))

            // this.props.children(this.slots/* .assignedNodes() */)
            // setChildReplacement(jsx(children, this.props), this.placeHolder, callStack('connectedCallback'))

            rKeys.forEach(k => this.removeAttribute(k))

            // props -> attr (1st)
            for (const k of aKeys as any)
                if (!this.attributes[this.propDict[k]] || isJsx(p))
                    setProp(this, this.propDict[k], p[k], callStack('connectedCallback'))
            // ------------

            // attr -> props (1st)
            for (const attr of this.attributes as any)
                this.attributeChangedCallback1(attr.name, undefined, attr.value)

            // // props -> attr(1st)
            // aKeys.forEach((k) => {
            //     if (!this.attributes[k])
            //         this.setAttribute(k, JSON.stringify($$(this.props[k])))
            //     // setAttribute(this, k, this.props[k], callStack('init connected'))
            // })

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
         * Called when the element is removed from the document
         * 
         * Cleans up observers and resources.
         */
        disconnectedCallback() {
            // Note: We don't unobserve stylesheet changes at the module level
            // since stylesheet observation is shared across all custom elements
            // and only initialized once
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

            if (newValue === '[object Object]') return //TSX's <my-comp obj={{}}> obj is raw object literal but not $()

            const { props } = this
            // if (!matchesWildcard(name, C.observedAttributes)) return

            // Check if this is a nested property (contains $ or .)
            if (name.includes('$') || name.includes('.')) {
                // Normalize the property path using the utility function
                const normalizedPath = normalizePropertyPath(name)

                // Handle nested properties (including style properties)
                setNestedProperty(this, normalizedPath, newValue)

                // Also update any observable in the nested path
                // Note: We need to convert the attribute name to the property name for the propDict lookup
                const propName = kebabToCamelCase(name.replace(/\$/g, '.').replace(/\./g, '.'))
                setObservableValue(props, propName, newValue)
            } else {
                // Handle flat properties (existing behavior)
                // Convert kebab-case attribute name to camelCase property name
                const propName = kebabToCamelCase(name)
                setObservableValue(this.props, propName, newValue)
            }
        }
    }

    const ec = customElements.get(tagName)
    if (!!ec)
        console.warn(`Element ${tagName} already exists. (ignore this in dev env), use ec.__component__ to find target component`)
    else
        customElements.define(tagName, C)

    return C
}
