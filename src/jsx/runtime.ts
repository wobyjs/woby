
/* IMPORT */

import '../types'
import './types'
export { Fragment } from '../components/fragment'
// import createElement from '../methods/create_element';
// import { wrapCloneElement } from '../methods/wrap_clone_element';
import type { Child, Component, ComponentFunction, Element } from '../types'
import { wrapCloneElement, CloneableType } from '../methods/wrap_clone_element'
import { createElement } from '../index'
import { isSSR, SYMBOL_CLONE, SYMBOL_DEFAULT, SYMBOL_JSX } from '../constants'
import { customElements as ces } from '../methods/ssr.obj'

const wrapJsx = <P>(props: P) => {
  if (props[SYMBOL_JSX]) return props
  props[SYMBOL_JSX] = true
  return props
}

export const unwrapJsx = <P>(props: P) => {
  delete props[SYMBOL_JSX]
  return props
}

const CES = isSSR ? ces : customElements

export const isJsx = <P>(props: P) => !!props[SYMBOL_JSX]


function getProps<P extends {} = { key?: string; children?: Child }>(component: string | Node | ComponentFunction<P>, props: P) {
  if (typeof component === 'string') {
    const ce = CES.get(component)
    if (!!ce) {
      const defaultPropsFn = (ce as any).__component__?.[SYMBOL_DEFAULT]
      if (!defaultPropsFn) {
        console.error(`Component ${component} is missing default props. Please use the 'defaults' helper function to provide default props.`)
      }
      if (!props) props = defaultPropsFn() ?? {}
    }
  }
  if (!props) props = {} as any

  return wrapJsx(props)
}


/* MAIN */
// const jsx = <P = {}>(component: Component<P>, props?: P | null, ...children: Child[]): Element => {
//     return wrapCloneElement(createElement<P>(component as any, props, ...children), component, props);
// };

// React 16
export function jsx<P extends {} = {}>(component: Component<P>, props?: P, ...children: Child[]): Element
//React 17
export function jsx<P extends {} = { key?: string; children?: Child }>(component: Component<P>, props?: P, key?: string): Element
export function jsx<P extends {} = { key?: string; children?: Child }>(component: Component<P>, props?: P, ...children: (string | Child)[]): Element {
  if (typeof children === 'string') // React 16, key
    return wrapCloneElement(createElement<P>(component as any, props ?? {} as P, children as string), component, props)

  props = getProps<P>(component, props)

  if (typeof children === 'string') // React 16, key
    Object.assign(props as any, { children })

  return wrapCloneElement(createElement<P>(component as any, props, ...children), component, props)
};

//React 17 only
export const jsxDEV = <P extends {} = {}>(component: Component<P>, props: P | null, key: string, isStatic: boolean, source: { fileName: string, lineNumber: number, columnNumber: number }, self: any): Element => {
  props = getProps<P>(component, props)

  if (key)
    Object.assign(props, { key })

  return wrapCloneElement(createElement<P>(component as any, props), component, props)
}

export const getMeta = (target: Element) => target?.[SYMBOL_CLONE] as CloneableType


export const jsxs = jsx 