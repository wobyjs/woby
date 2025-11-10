
/* IMPORT */

import '../types'
import './types'
export { Fragment } from '../components/fragment'
// import createElement from '../methods/create_element';
// import { wrapCloneElement } from '../methods/wrap_clone_element';
import type { Child, Component, ComponentFunction, Element } from '../types'
import { wrapCloneElement, CloneableType } from '../methods/wrap_clone_element'
import { createElement } from '../index'
import { isObject, isString } from '../utils/lang'
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
  // Handle React 17 style where children might be in props
  let normalizedProps = props ?? {} as P;
  
  // Check if we have children in props
  const hasChildrenInProps = normalizedProps && isObject(normalizedProps) && 'children' in normalizedProps;
  
  // Handle React 16 style - children passed as separate arguments
  if (children.length > 0) {
    // If we also have children in props, we need to be careful
    // In React, when both are present, it's an error, but let's handle it gracefully
    if (hasChildrenInProps) {
      // Remove children from props to avoid duplication
      const { children: propsChildren, ...restProps } = normalizedProps as any;
      normalizedProps = restProps as P;
    }
    
    normalizedProps = getProps<P>(component, normalizedProps);
    
    // Handle the special case where children is a single string (could be a key)
    if (children.length === 1 && typeof children[0] === 'string') {
      // If this is actually a key (not content), we should put it in props
      // But if it's content, we should pass it as children
      // For now, let's assume it's content and pass it as children
      return wrapCloneElement(createElement<P>(component as any, normalizedProps, children[0]), component, normalizedProps);
    }
    
    return wrapCloneElement(createElement<P>(component as any, normalizedProps, ...children), component, normalizedProps);
  } 
  // Handle React 17 style - children in props only
  else if (hasChildrenInProps) {
    const { children: propsChildren, ...restProps } = normalizedProps as any;
    normalizedProps = restProps as P;
    normalizedProps = getProps<P>(component, normalizedProps);
    
    // Add the children back but pass them as arguments to createElement
    return wrapCloneElement(createElement<P>(component as any, normalizedProps, propsChildren), component, normalizedProps);
  } 
  // No children at all
  else {
    normalizedProps = getProps<P>(component, normalizedProps);
    return wrapCloneElement(createElement<P>(component as any, normalizedProps), component, normalizedProps);
  }
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