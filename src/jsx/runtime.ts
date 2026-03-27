
/* IMPORT */

import '../types'
import './types'
export { Fragment } from '../components/fragment'
// import createElement from '../methods/create_element';
// import { wrapCloneElement } from '../methods/wrap_clone_element';
import type { Child, Component, ComponentFunction, Element } from '../types'
import { wrapCloneElement, CloneableType } from '../methods/wrap_clone_element'
import { createElement } from '../methods/create_element'
import { isObject, isString } from '../utils/lang'
import { SYMBOL_CLONE, SYMBOL_DEFAULT, SYMBOL_JSX } from '../constants'
import { customElements as ces } from '../ssr/custom_elements'
import { wobyCustomElements } from '../methods/custom_element_registry'
import { useEnvironment, showEnvLog } from '../components/environment_context'

const wrapJsx = <P>(props: P) => {
  if (props[SYMBOL_JSX]) return props
  props[SYMBOL_JSX] = true
  return props
}

export const unwrapJsx = <P>(props: P) => {
  delete props[SYMBOL_JSX]
  return props
}

export const isJsx = <P>(props: P) => !!props[SYMBOL_JSX]


function getProps<P extends {} = { key?: string; children?: Child }>(component: string | Node | ComponentFunction<P>, props: P) {
  const env = useEnvironment()
  const isSSR = env === 'ssr'

  // Use wobyCustomElements so JSX tag lookups go through the woby-scoped
  // registry first (which falls back to native for non-woby tags).
  const CES = isSSR ? ces : wobyCustomElements

  if (typeof component === 'string') {
    const ceMeta = isSSR ? (CES.get(component) ? { ctor: CES.get(component)!, isNative: false } : undefined) : (CES as typeof wobyCustomElements).getWithMeta(component)
    if (ceMeta) {
      if (!ceMeta.isNative) {
        const defaultPropsFn = (ceMeta.ctor as any).__component__?.[SYMBOL_DEFAULT]
        if (!defaultPropsFn) {
          console.error(`Component ${component} is missing default props. Please use the 'defaults' helper function to provide default props.`)
        }
        if (!props) props = defaultPropsFn?.() ?? {}
      }
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
  // console.log('[jsx] Entry, env:', useEnvironment())
  if (typeof children === 'string') // React 16, key
    return wrapCloneElement(createElement<P>(component as any, props ?? {} as P, children as string), component, props)

  // console.log('[jsx] Before getProps, env:', useEnvironment())
  props = getProps<P>(component, props)
  // console.log('[jsx] After getProps, env:', useEnvironment())

  if (typeof children === 'string') // React 16, key
    Object.assign(props as any, { children })

  if (showEnvLog)
    console.log('ENV jsx: ', useEnvironment())

  return wrapCloneElement(createElement<P>(component as any, props, (props as any)?.key as string), component, props)
}

//React 17 only
export const jsxDEV = <P extends {} = {}>(component: Component<P>, props: P | null, key: string, isStatic: boolean, source: { fileName: string, lineNumber: number, columnNumber: number }, self: any): Element => {
  // console.log('[jsxDEV] Entry, env:', useEnvironment())
  props = getProps<P>(component, props)
  // console.log('[jsxDEV] After getProps, env:', useEnvironment())

  if (key)
    Object.assign(props, { key })

  if (showEnvLog)
    console.log('ENV jsxDEV: ', useEnvironment())

  return wrapCloneElement(createElement<P>(component as any, props), component, props)
}

export const getMeta = (target: Element) => target?.[SYMBOL_CLONE] as CloneableType


export const jsxs = jsx 