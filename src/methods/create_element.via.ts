

import { untrack } from '../methods/soby'
import { wrapElement } from '../methods/wrap_element'
import { createHTMLNode, createSVGNode } from '../utils/creators.via'
import { isFunction, isNode, isObject, isString, isSVGElement, isVoidChild } from '../utils/lang'
import { setChild, setProps } from '../utils/setters.via'
import type { Child, Component, Element, Props } from '../types'
import { IgnoreSymbols } from 'via.js'
import { FragmentUtils } from '../utils/fragment'
// import { JSX } from '../jsx/types';


export const IsSvgSymbol = Symbol('isSvg')

IgnoreSymbols[IsSvgSymbol] = IsSvgSymbol

// It's important to wrap components, so that they can be executed in the right order, from parent to child, rather than from child to parent in some cases

export const createElement = <P = { children?: Child }>(component: Component<P>, _props?: P | null, ..._children: Child[]): Element => {
    console.log('[createElement] Called with component:', typeof component === 'function' ? component.name || 'anonymous function' : component, 'props:', _props, 'children:', _children)
    const children = _children.length > 1 ? _children : (_children.length > 0 ? _children[0] : undefined)
    const hasChildren = !isVoidChild(children)

    if (hasChildren && isObject(_props) && 'children' in _props) {

        throw new Error('Providing "children" both as a prop and as rest arguments is forbidden')

    }

    if (isFunction(component)) {

        const props = hasChildren ? { ..._props, children } : _props
        console.log('[createElement] Component is function, props:', props)

        return wrapElement(() => {

            console.log('[createElement.wrapElement] About to execute component function')
            const result = untrack(() => component.call(component, props as P)) //TSC
            console.log('[createElement.wrapElement] Component executed, result type:', typeof result, result?.constructor?.name)
            return result

        })

    } else if (isString(component)) {

        const isSVG = isSVGElement(component)
        const createNode = isSVG ? createSVGNode : createHTMLNode
        console.log('[createElement] Component is string (HTML tag):', component, 'isSVG:', isSVG)

        return wrapElement((): Child => {
            const child = createNode(component as any) as any as HTMLElement //TSC
            console.log('[createElement.createNode] DOM node created:', child.tagName || child.nodeName)

            if (isSVG) {
                child['isSVG'] = true     // set via
                child[IsSvgSymbol] = true // set proxy
            }

            const stack = new Error()

            untrack(() => {

                if (_props) {
                    console.log('[createElement.untrack] Setting props on element:', _props)
                    setProps(child, _props as any, stack)
                    console.log('[createElement.untrack] Props set complete')
                }

                if (hasChildren) {
                    console.log('[createElement.untrack] Setting children on element:', children)
                    setChild(child, children, /* FragmentUtils.make(), */ stack)
                    console.log('[createElement.untrack] Children set complete')
                }

            })

            return child as any

        })

    } else if (isNode(component)) {

        console.log('[createElement] Component is Node')
        return wrapElement(() => component)

    } else {

        throw new Error('Invalid component')

    }

}