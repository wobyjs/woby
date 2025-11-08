/**
 * Element Creation API for Woby Framework
 * 
 * This module provides the createElement function which is responsible for creating elements 
 * in the Woby framework. It handles different types of components including functional components,
 * HTML elements, SVG elements, and custom elements.
 * 
 * @module createElement
 */

import { untrack } from '../methods/soby'
import { wrapElement } from '../methods/wrap_element'
import { createComment, createHTMLNode, createSVGNode, createText } from '../utils/creators'
import { createHTMLNode as createHTMLNodeSSR, createSVGNode as createSVGNodeSSR } from '../utils/creators.ssr'
import { isClass, isFunction, isNode, isObject, isString, isSVGElement, isVoidChild } from '../utils/lang'
import { setChild, setProps } from '../utils/setters'
import { setChild as setChildSSR, setProps as setPropsSSR } from '../utils/setters.ssr'
import type { Child, Component, Element } from '../types'
import { FragmentUtils } from '../utils/fragment'
import { customElement } from './custom_element'
import { Stack } from 'soby'
import { customElements as ces } from './ssr.obj'
import { createSSRCustomElement } from './custom_element.ssr'
import { isSSR } from '../constants'

if (isSSR) globalThis.customElements = ces as any

/**
 * Creates an element from a component, props, and children
 * 
 * This function is the core of the Woby rendering system. It handles the creation of elements
 * from various types of components:
 * 1. Functional components - Calls the function with props
 * 2. Class components - Instantiates the class with props
 * 3. String components - Creates HTML/SVG elements or custom elements
 * 4. Node components - Wraps existing DOM nodes
 * 
 * @template P - The type of props for the component
 * @param component - The component to create (function, class, string tag name, or DOM node)
 * @param _props - The props to pass to the component
 * @param _children - The children elements
 * @returns A wrapped element that can be rendered
 * 
 * @example
 * ```tsx
 * // Creating a functional component
 * const MyComponent = ({ name }: { name: string }) => <div>Hello, {name}!</div>
 * const element = createElement(MyComponent, { name: 'World' })
 * 
 * // Creating an HTML element
 * const divElement = createElement('div', { className: 'container' }, 'Hello World')
 * 
 * // Creating an SVG element
 * const svgElement = createElement('svg', { width: 100, height: 100 })
 * 
 * // Creating a custom element
 * customElement('my-custom-element', ({ value }: { value: number }) => <div>Value: {value}</div>)
 * const customElementInstance = createElement('my-custom-element', { value: 42 })
 * ```
 */
export const createElement = <P = { children?: Child }>(component: Component<P>, _props?: P | null, ..._children: Child[]) => {

    const children = _children.length > 1 ? _children : (_children.length > 0 ? _children[0] : undefined)
    const hasChildren = !isVoidChild(children)
    const { ...rest } = _props ?? {}

    if (hasChildren && isObject(_props) && 'children' in _props) {

        throw new Error('Providing "children" both as a prop and as rest arguments is forbidden')

    }

    // Use different logic based on SSR mode
    if (isSSR) {
        // SSR-specific logic
        const props = _props ?? {}

        if (isFunction(component)) {

            const props = hasChildren ? { ..._props, children } : _props

            return wrapElement(() => {

                return untrack(() => isClass(component) ? new (component as any)(props) : component.call(component, props as P)) //TSC

            })

        } else if (isString(component)) {

            const isSVG = isSVGElement(component)
            const createNode = isSVG ? createSVGNodeSSR : createHTMLNodeSSR

            return wrapElement((): Child => {
                // Check if we're in SSR mode (no customElements API)
                const isSSRMode = typeof customElements === 'undefined'
                let ce = null

                // Only try to get custom element if we're not in SSR mode
                if (!isSSRMode) {
                    ce = customElements.get(component) as ReturnType<typeof customElement>
                }

                const child = createNode(component) as HTMLElement //TSC

                // Check if this is our custom element class (SSR version)
                if (!!ce) {
                    // For SSR custom elements, we need to handle them differently
                    if (typeof ce === 'function' && (ce as any).__component__) {
                        // This is our SSR custom element, just pass props directly
                        (child as any).props = { ..._props }
                    } else {
                        // This is a regular custom element - cast to any to avoid TypeScript errors
                        (child as any).props = { ..._props }
                    }
                }

                if (isSVG) child['isSVG'] = true

                const stack = new Error()

                untrack(() => {

                    if (_props) {
                        setPropsSSR(child, _props as any, stack)
                    }

                    // Set children for both regular HTML elements and custom elements
                    if (hasChildren) {
                        // For SSR custom elements, we need to handle them differently
                        if (ce && typeof ce === 'function' && (ce as any).__component__) {
                            setChildSSR(child, !!ce ? createElement((ce as any).__component__, (child as any).props) : children, FragmentUtils.make(), stack)
                        } else {
                            // For regular HTML elements, just set the children directly
                            setChildSSR(child, children, FragmentUtils.make(), stack)
                        }
                    } else if (_props && isObject(_props) && 'children' in _props && !isVoidChild((_props as any).children)) {
                        // Handle children from props
                        const propsChildren = (_props as any).children as Child
                        // For SSR custom elements, we need to handle them differently
                        if (ce && typeof ce === 'function' && (ce as any).__component__) {
                            setChildSSR(child, !!ce ? createElement((ce as any).__component__, (child as any).props) : propsChildren, FragmentUtils.make(), stack)
                        } else {
                            // For regular HTML elements, just set the children directly
                            setChildSSR(child, propsChildren, FragmentUtils.make(), stack)
                        }
                    }

                })

                return child

            })

        } else if (isNode(component)) {

            return wrapElement(() => component)

        } else {

            throw new Error('Invalid component')

        }
    } else {
        // Client-side logic
        const props = _props ?? {}

        if (isFunction(component)) {
            return wrapElement(() => {

                return untrack(() => isClass(component) ? new (component as any)(props) : component.call(component, props as P)) //TSC

            })

        } else if (isString(component)) {

            const isSVG = isSVGElement(component)
            const isComment = component === 'comment'
            const isText = component === 'text'

            const createNode = isSVG ? createSVGNode : createHTMLNode
            const create = isComment ? () => createComment((props as any).data ?? '') : isText ? () => createText((props as any).data ?? '') : createNode

            return wrapElement((): Child => {
                const ce = customElements.get(component) as ReturnType<typeof customElement>

                const child = !!ce ? new ce(props as any) : create(component) as HTMLElement

                // if (!!ce)
                //     (child as InstanceType<ReturnType<typeof customElement>>).props = { ...props }

                if (isSVG) child['isSVG'] = true

                const stack = new Stack()

                untrack(() => {

                    if (props) {
                        if (!!ce) {
                            const { children, ...np } = props as any //children already initialized in new ce(props)
                            setProps(child, np, stack)
                        }
                        else
                            setProps(child, props as any, stack)
                    }

                    //already in prop
                    if (hasChildren) {
                        setChild(child, children, FragmentUtils.make(), stack)
                    }

                })

                return child as any

            })

        } else if (isNode(component)) {

            return wrapElement(() => component)

        } else {

            throw new Error('Invalid component')

        }
    }
}