
/* IMPORT */

import untrack from '../methods/untrack'
import wrapElement from '../methods/wrap_element'
import { createHTMLNode, createSVGNode } from '../utils/creators'
import { isClass, isFunction, isNode, isObject, isString, isSVGElement, isVoidChild } from '../utils/lang'
import { setChild, setProps } from '../utils/setters'
import type { Child, Component, Element } from '../types'
import { FragmentUtils } from '../utils/fragment'
import { customElement } from './custom_element'


/* MAIN */

// It's important to wrap components, so that they can be executed in the right order, from parent to child, rather than from child to parent in some cases

const createElement = <P = { children?: Child }>(component: Component<P>, _props?: P | null, ..._children: Child[]) => {

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
            const ce = customElements.get(component) as ReturnType<typeof customElement>
            const child = createNode(component) as HTMLElement //TSC

            if (!!ce)
                (child as InstanceType<ReturnType<typeof customElement>>).props = { ..._props }

            if (isSVG) child['isSVG'] = true

            const stack = new Error()

            untrack(() => {

                if (_props) {
                    setProps(child, _props as any, stack)
                }

                if (hasChildren || ce?.__children__) {
                    setChild(child, !!ce ? createElement(ce.__children__, (child as InstanceType<ReturnType<typeof customElement>>).props) : children, FragmentUtils.make(), stack)
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

/* EXPORT */

export default createElement