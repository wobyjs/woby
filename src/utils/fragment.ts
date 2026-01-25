
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
    console.log('Created placeholder text node:', placeholder)
    return placeholder
  },

  // Check if a node is a placeholder
  isPlaceholder: (node: Node): boolean => {
    return !!(node as any).__isPlaceholder
  },

  // Replace placeholder with actual content using SYMBOL_DOM pattern
  replacePlaceholder: (placeholder: Node, newContent: Node, componentFn: Function | null = null): void => {
    console.log('Replacing placeholder:', placeholder)
    console.log('With new content:', newContent)

    const parent = placeholder.parentNode
    if (!parent) {
      console.warn('Placeholder has no parent, cannot replace')
      return
    }

    // Perform the replacement
    parent.replaceChild(newContent, placeholder)

    // Store reference in component function if provided (SYMBOL_DOM pattern)
    if (componentFn) {
      componentFn[SYMBOL_DOM] = newContent
      console.log('Stored new content in component fn SYMBOL_DOM')
    }

    console.log('Replacement completed')
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
    console.log('=== GET CHILDREN FRAGMENTED ===')
    console.log('Fragment:', thiz)
    console.log('Fragment length:', thiz.length)
    console.log('Fragment values:', thiz.values)
    console.log('Children array:', children)

    const { values, length } = thiz

    if (!length) {
      console.log('No length, returning children')
      return children
    }

    if (values instanceof Array) {
      console.log('Values is array, length:', values.length)

      for (let i = 0, l = values.length; i < l; i++) {
        console.log(`Processing values[${i}]:`, values[i])
        console.log(`  Typeof values[${i}]:`, typeof values[i])
        console.log(`  values[${i}] instanceof Node:`, values[i] && typeof (values[i] as any).nodeType === 'number')

        const value = values[i]

        if ((typeof value === 'object' && value && 'nodeType' in value && typeof (value as any).nodeType === 'number')) {
          console.log('Pushing Node to children:', value)
          console.log('  Node nodeType:', (value as any)?.nodeType)
          console.log('  Node textContent:', (value as any)?.textContent)
          console.log('  Node objectId:', (value as any)?.objectId)
          console.log('  Node constructor:', (value as any)?.constructor?.name)
          children.push(value as Node)

        } else {
          console.log('Recursing into fragment:', value)
          FragmentUtils.getChildrenFragmented(value as Fragment, children)

        }

      }

    } else {
      console.log('Values is not array')
      console.log('  Typeof values:', typeof values)
      console.log('  values instanceof Node:', values && typeof (values as any).nodeType === 'number')
      console.log('  values:', values)

      if ((typeof values === 'object' && values && 'nodeType' in values && typeof (values as any).nodeType === 'number')) {
        console.log('Pushing single Node to children:', values)
        console.log('  Node nodeType:', (values as any)?.nodeType)
        console.log('  Node textContent:', (values as any)?.textContent)
        console.log('  Node objectId:', (values as any)?.objectId)
        console.log('  Node constructor:', (values as any)?.constructor?.name)
        children.push(values as Node)

      } else {
        console.log('Recursing into single fragment:', values)
        FragmentUtils.getChildrenFragmented(values as Fragment, children)

      }

    }

    console.log('Returning children:', children)
    return children

  },

  getChildren: (thiz: Fragment): (Node | { nodeType: number }) | (Node | { nodeType: number })[] => {
    console.log('=== FRAGMENT GET CHILDREN ===')
    console.log('Fragment:', thiz)
    console.log('Fragment length:', thiz.length)
    console.log('Fragment fragmented:', thiz.fragmented)
    console.log('Fragment values:', thiz.values)

    if (!thiz.length) {
      console.log('Returning NOOP_CHILDREN')
      return NOOP_CHILDREN
    }

    if (!thiz.fragmented) {
      console.log('Returning direct values')
      const result = thiz.values as any
      console.log('Direct values result:', result)
      if (result) {
        console.log('Result nodeType:', result?.nodeType)
        console.log('Result textContent:', (result as any)?.textContent)
        console.log('Result objectId:', (result as any)?.objectId)
        console.log('Result constructor:', result?.constructor?.name)
      }
      return result
    }

    if (thiz.length === 1) {
      console.log('Getting children from single fragment value')
      return FragmentUtils.getChildren(thiz.values)
    }

    console.log('Getting children fragmented')
    return FragmentUtils.getChildrenFragmented(thiz)

  },

  pushFragment: (thiz: Fragment, fragment: Fragment): void => {

    FragmentUtils.pushValue(thiz, fragment)

    thiz.fragmented = true

  },

  pushNode: (thiz: Fragment, node: Node | { nodeType: number }): void => {
    console.log('=== FRAGMENT PUSH NODE ===')
    console.log('Pushing node to fragment:', node)
    console.log('Node nodeType:', node?.nodeType)
    console.log('Node textContent:', (node as any)?.textContent)
    console.log('Node objectId:', (node as any)?.objectId)
    console.log('Node constructor:', node?.constructor?.name)

    // Check if we're pushing a TextNode that might get converted
    if (node?.nodeType === 3 && (node as any)?.textContent) {
      console.log('✅ Pushing TextNode with content:', (node as any)?.textContent)
    }

    FragmentUtils.pushValue(thiz, node)

    console.log('Fragment after push - length:', thiz.length)
    console.log('Fragment after push - values:', thiz.values)
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

