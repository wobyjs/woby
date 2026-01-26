
/* IMPORT */

import { BaseNode } from '../ssr/base_node'
import { isSSR, SYMBOL_DOM } from '../constants'
import type { FragmentNode, FragmentFragment, Fragment } from '../types'
import { getEnv } from '../utils/creators'

/* HELPERS */

const NOOP_CHILDREN: (Node | { nodeType: number })[] = []

/* MAIN */
// if (isSSR) globalThis.Node = class { } as any // Removed to prevent breaking Node inheritance

export const FragmentUtils = {

  make: (): Fragment => {
    return {
      values: undefined,
      length: 0
    }
  },

  // Create placeholder for reactive content that will be replaced later
  makePlaceholder: (env: 'ssr' | 'browser' | 'via' = 'browser'): Node => {
    const { createText } = getEnv(env)
    // Create empty text node as placeholder
    const placeholder = createText('') as unknown as Node
      // Mark it as placeholder for identification
      ; (placeholder as any).__isPlaceholder = true
    return placeholder
  },

  // Check if a node is a placeholder
  isPlaceholder: (node: Node): boolean => {
    return !!(node as any).__isPlaceholder
  },

  // Replace placeholder with actual content using SYMBOL_DOM pattern
  replacePlaceholder: (placeholder: Node, newContent: Node, componentFn: Function | null = null): void => {

    const parent = placeholder.parentNode
    if (!parent) {
      return
    }

    // Perform the replacement
    parent.replaceChild(newContent, placeholder)

    // Store reference in component function if provided (SYMBOL_DOM pattern)
    if (componentFn) {
      componentFn[SYMBOL_DOM] = newContent
    }

  },

  makeWithNode: (node: Node): FragmentNode => {

    return {
      values: node,
      length: 1
    }

  },

  makeWithFragment: (fragment: Fragment): FragmentFragment => {

    return {
      values: fragment,
      fragmented: true,
      length: 1
    }

  },

  getChildrenFragmented: (thiz: Fragment, children: (Node | { nodeType: number })[] = []): (Node | { nodeType: number })[] => {

    const { values, length } = thiz

    if (!length) {
      return children
    }

    if (values instanceof Array) {

      for (let i = 0, l = values.length; i < l; i++) {


        const value = values[i]

        if ((typeof value === 'object' && value && 'nodeType' in value && typeof (value as any).nodeType === 'number')) {
          children.push(value as Node)

        } else {
          FragmentUtils.getChildrenFragmented(value as Fragment, children)

        }

      }

    } else {

      if ((typeof values === 'object' && values && 'nodeType' in values && typeof (values as any).nodeType === 'number')) {
        children.push(values as Node)

      } else {
        FragmentUtils.getChildrenFragmented(values as Fragment, children)

      }

    }

    return children

  },

  getChildren: (thiz: Fragment): (Node | { nodeType: number }) | (Node | { nodeType: number })[] => {

    if (!thiz.length) {
      return NOOP_CHILDREN
    }

    if (!thiz.fragmented) {
      const result = thiz.values as any
      return result
    }

    if (thiz.length === 1) {
      return FragmentUtils.getChildren(thiz.values)
    }

    return FragmentUtils.getChildrenFragmented(thiz)

  },

  pushFragment: (thiz: Fragment, fragment: Fragment): void => {

    FragmentUtils.pushValue(thiz, fragment)

    thiz.fragmented = true

  },

  pushNode: (thiz: Fragment, node: Node | { nodeType: number }): void => {


    FragmentUtils.pushValue(thiz, node)

  },

  pushValue: (thiz: Fragment, value: Node | { nodeType: number } | Fragment): void => {

    const { values, length } = thiz as any //TSC

    if (length === 0) {

      thiz.values = value as any

    } else if (length === 1) {

      thiz.values = [values as any, value as any]

    } else {

      (values as any).push(value)

    }

    thiz.length += 1

  },

  replaceWithNode: (thiz: Fragment, node: Node | { nodeType: number } | BaseNode): void => {

    thiz.values = node as any
    delete thiz.fragmented
    thiz.length = 1

  },

  replaceWithFragment: (thiz: Fragment, fragment: Fragment): void => {

    thiz.values = fragment.values
    thiz.fragmented = fragment.fragmented
    thiz.length = fragment.length

  }

}

