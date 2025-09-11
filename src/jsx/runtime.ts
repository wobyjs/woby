
/* IMPORT */

import '../types'
import './types'
import Fragment from '../components/fragment'
// import createElement from '../methods/create_element';
// import { wrapCloneElement } from '../methods/wrap_clone_element';
import type { Child, Component, Element } from '../types'
import { wrapCloneElement, createElement, CloneableType } from '../index'
import { SYMBOL_CLONE, SYMBOL_JSX } from '../constants'

const wrapJsx = <P>(props: P) => {
  if (props[SYMBOL_JSX]) return props
  props[SYMBOL_JSX] = true
  return props
}
/* MAIN */
// const jsx = <P = {}>(component: Component<P>, props?: P | null, ...children: Child[]): Element => {
//     return wrapCloneElement(createElement<P>(component as any, props, ...children), component, props);
// };

// React 16
function jsx<P extends {} = {}>(component: Component<P>, props?: P, ...children: Child[]): Element
//React 17
function jsx<P extends {} = { key?: string; children?: Child }>(component: Component<P>, props?: P, key?: string): Element
function jsx<P extends {} = { key?: string; children?: Child }>(component: Component<P>, props?: P, ...children: (string | Child)[]): Element {
  if (typeof children === 'string') // React 16, key
    return wrapCloneElement(createElement<P>(component as any, props ?? {} as P, children as string), component, props)

  if (!props) props = {} as any
  wrapJsx(props)
  if (typeof children === 'string') // React 16, key
    Object.assign(props as any, { children })

  return wrapCloneElement(createElement<P>(component as any, props, (props as any)?.key as string), component, props)
};

//React 17 only
const jsxDEV = <P extends {} = {}>(component: Component<P>, props: P | null, key: string, isStatic: boolean, source: { fileName: string, lineNumber: number, columnNumber: number }, self: any): Element => {
  if (!props) props = {} as any
  wrapJsx(props)

  if (key)
    Object.assign(props, { key })

  return wrapCloneElement(createElement<P>(component as any, props), component, props)
}

export const getMeta = (target: Element) => target?.[SYMBOL_CLONE] as CloneableType

/* EXPORT */

export { jsx, jsx as jsxs, jsxDEV, Fragment }
