
/* IMPORT */

import type { FragmentNode, FragmentFragment, Fragment } from '../types'
import type { Comment as CommentSSR } from '../ssr/comment'
import { BaseNode } from '../ssr/base_node'

/* HELPERS */

const NOOP_CHILDREN: Node[] = []

/* MAIN */
const Node = globalThis.Node ?? BaseNode

export const FragmentUtils = {

  make: (): Fragment => {

    return {
      values: undefined,
      length: 0
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

  getChildrenFragmented: (thiz: Fragment, children: (Node | Comment | CommentSSR)[] = []): (Node | Comment | CommentSSR)[] => {

    const { values, length } = thiz

    if (!length) return children

    if (values instanceof Array) {

      for (let i = 0, l = values.length; i < l; i++) {

        const value = values[i]

        if (value instanceof Node) {

          children.push(value)

        } else {

          FragmentUtils.getChildrenFragmented(value as any, children)

        }

      }

    } else {

      if (values instanceof Node) {

        children.push(values)

      } else {

        FragmentUtils.getChildrenFragmented(values as any, children)

      }

    }

    return children

  },

  getChildren: (thiz: Fragment): (Node | Node | Comment | CommentSSR | Comment)[] => {

    if (!thiz.length) return NOOP_CHILDREN

    if (!thiz.fragmented) return thiz.values as any

    if (thiz.length === 1) return FragmentUtils.getChildren(thiz.values as any)

    return FragmentUtils.getChildrenFragmented(thiz)

  },

  pushFragment: (thiz: Fragment, fragment: Fragment): void => {

    FragmentUtils.pushValue(thiz, fragment)

    thiz.fragmented = true

  },

  pushNode: (thiz: Fragment, node: Node | Comment | CommentSSR): void => {

    FragmentUtils.pushValue(thiz, node)

  },

  pushValue: (thiz: Fragment, value: Node | Fragment | Comment | CommentSSR): void => {

    const { values, length } = thiz as any //TSC

    if (length === 0) {

      thiz.values = value as Fragment

    } else if (length === 1) {

      thiz.values = [values, value]

    } else {

      values.push(value)

    }

    thiz.length += 1

  },

  replaceWithNode: (thiz: Fragment, node: Node): void => {

    thiz.values = node
    delete thiz.fragmented
    thiz.length = 1

  },

  replaceWithFragment: (thiz: Fragment, fragment: Fragment): void => {

    thiz.values = fragment.values
    thiz.fragmented = fragment.fragmented
    thiz.length = fragment.length

  }

}

