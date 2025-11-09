import { isSSR } from '../constants'
import { createElement } from '../methods/create_element'
import { isArray, isObject } from '../utils/lang'
import type { Child, Component, Element } from '../types'


export function h<P extends { children?: Child } = {}>(component: Component<P>, child: Child): Element
export function h<P extends { children?: Child } = {}>(component: Component<P>, props?: P | null, ...children: Child[]): Element
export function h<P extends { children?: Child } = {}>(component: Component<P>, props?: Child | P | null, ...children: Child[]): Element {

  // return createElement(component, props, key, isStatic, source, self); //TSC

  if (children.length || (isObject(props) && !isArray(props))) {
    if (!props) props = { children } as any
    else props = { ...(props as object), children } as P
    return createElement(component, props as any) //TSC

  } else {

    return createElement(component, null, props as Child) //TSC

  }

}