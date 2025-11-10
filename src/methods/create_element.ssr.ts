import { untrack } from './soby'
import { wrapElement } from './wrap_element'
import { createHTMLNode, createSVGNode } from '../utils/creators.ssr'
import { isClass, isFunction, isNode, isObject, isString, isSVGElement, isVoidChild } from '../utils/lang'
import { setChild, setProps } from '../utils/setters.ssr'
import type { Child, Component, Element, Observable } from '../types'
import { FragmentUtils } from '../utils/fragment'
import { customElement } from './custom_element'



// It's important to wrap components, so that they can be executed in the right order, from parent to child, rather than from child to parent in some cases

export const createElement = <P = { children?: Observable<Child> }>(component: Component<P>, _props?: P | null, ..._children: Child[]) => {

    const children = _children.length > 1 ? _children : (_children.length > 0 ? _children[0] : undefined)
    const hasChildren = !isVoidChild(children)
    const { ...rest } = _props ?? {}

    if (hasChildren && isObject(_props) && 'children' in _props) {

        throw new Error('Providing "children" both as a prop and as rest arguments is forbidden')

    }

    if (isFunction(component)) {

        const props = hasChildren ? { ..._props, children } : _props

        return wrapElement(() => {

            return untrack(() => isClass(component) ? new (component as any)(props) : component.call(component, props as P)) //TSC

        })

    } else if (isString(component)) {

        const isSVG = isSVGElement(component)
        const createNode = isSVG ? createSVGNode : createHTMLNode

        return wrapElement((): Child => {
            // Check if we're in SSR mode (no customElements API)
            const isSSR = typeof customElements === 'undefined'
            let ce = null

            // Only try to get custom element if we're not in SSR mode
            if (!isSSR) {
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
                    setProps(child, _props as any, stack)
                }

                // Set children for both regular HTML elements and custom elements
                if (hasChildren) {
                    // For SSR custom elements, we need to handle them differently
                    if (ce && typeof ce === 'function' && (ce as any).__component__) {
                        setChild(child, !!ce ? createElement((ce as any).__component__, (child as any).props) : children, FragmentUtils.make(), stack)
                    } else {
                        // For regular HTML elements, just set the children directly
                        setChild(child, children, FragmentUtils.make(), stack)
                    }
                } else if (_props && isObject(_props) && 'children' in _props && !isVoidChild((_props as any).children)) {
                    // Handle children from props
                    const propsChildren = (_props as any).children as Child
                    // For SSR custom elements, we need to handle them differently
                    if (ce && typeof ce === 'function' && (ce as any).__component__) {
                        setChild(child, !!ce ? createElement((ce as any).__component__, (child as any).props) : propsChildren, FragmentUtils.make(), stack)
                    } else {
                        // For regular HTML elements, just set the children directly
                        setChild(child, propsChildren, FragmentUtils.make(), stack)
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

}