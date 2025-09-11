
/* IMPORT */

import type { Child, Props } from '../types';;
import { isFunction, isPrimitive } from '../utils/lang'
import { SYMBOL_CLONE } from '../constants'
import createElement from './create_element.ssr'
import { CloneableType, wrapCloneElement } from './wrap_clone_element'

/* MAIN */

export const cloneElement = <P extends Props>(element: Child | Element, props: P, ...children: Child[]): Child => {
  if (isPrimitive(element))
    return element
  else if (isFunction(element)) {
    if (!element[SYMBOL_CLONE])
      throw new Error('target is not cloneable, it is not created by jsx.createElement')

    const { Component, props: oldProps } = element[SYMBOL_CLONE] as CloneableType<P>
    const newProps = { ...oldProps, ...props }
    if (children.length > 0)
      Object.assign(props, { children })

    return wrapCloneElement(createElement<P>(Component as any, newProps), Component, newProps)
  }
  else if (Array.isArray(element))
    return element.map(e => cloneElement(e, props))
  else if ((element as Element).cloneNode) //native html
    return (element as Element).cloneNode()

  throw new Error("Unknown element")
}

export default cloneElement

