import type { Child, Props } from '../types'
import { isArray, isFunction, isPrimitive } from '../utils/lang'
import { SYMBOL_CLONE } from '../constants'
import { createElement } from '../methods/create_element'
import { CloneableType, wrapCloneElement } from '../methods/wrap_clone_element'


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
  else if (isArray(element))
    return element.map(e => cloneElement(e, props))
  else if ((element as Element).cloneNode) //native html
    return (element as Element).cloneNode()

  throw new Error("Unknown element")
}