/* IMPORT */

import '../types'
// import Fragment from '../components/fragment';
// import createElement from '../methods/create_element.ssr';
// import { wrapCloneElement } from '../methods/wrap_clone_element';
import type { Child, Component, Element } from '../types'
import { SYMBOL_CLONE, createElement, wrapCloneElement } from '../ssr'
// import $ from 'soby'

/* MAIN */

// React 16
export function jsx<P extends {} = {}>(component: Component<P>, props?: P, ...children: Child[]): Element
//React 17
export function jsx<P extends {} = { key?: string; children?: Child }>(component: Component<P>, props?: P, key?: string): Element
export function jsx<P extends {} = { key?: string; children?: Child }>(component: Component<P>, props?: P, ...children: (string | Child)[]): Element {
  // Handle React 16 case where children are passed as separate arguments
  if (children.length > 0) {
    // If props is null or undefined, create an empty object
    if (!props) props = {} as any

    // For React 16, pass children as separate arguments to createElement
    return wrapCloneElement(createElement<P>(component as any, props, ...children), component, props)
  }

  // Handle React 17 case where children might be in props
  // Check if props contains children and no separate children were passed
  if (props && 'children' in props) {
    // Extract children from props and pass them as separate arguments to avoid duplication
    const { children: propsChildren, ...restProps } = props as any
    return wrapCloneElement(createElement<P>(component as any, restProps as any, propsChildren), component, props)
  }

  // Handle React 17 case where key might be passed as third parameter
  if (!props) props = {} as any

  // Pass props to createElement (without key as separate param since createElement handles it differently)
  return wrapCloneElement(createElement<P>(component as any, props), component, props)
};

//React 17 only
export const jsxDEV = <P extends {} = {}>(component: Component<P>, props: P | null, key: string, isStatic: boolean, source: { fileName: string, lineNumber: number, columnNumber: number }, self: any): Element => {
  if (key)
    Object.assign(props, { key })
  return wrapCloneElement(createElement<P>(component as any, props), component, props)
}

export const getMeta = (target: Element) => target[SYMBOL_CLONE]

export const jsxs = jsx
// const jsxs = <P extends { children: any | any[] }>(component: Component<P>, props?: P | null): Element => {
//     return jsx(component, props)
// }