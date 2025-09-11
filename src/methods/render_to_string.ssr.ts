/* IMPORT */

import { FragmentUtils } from '../utils/fragment.ssr'
import type { Child } from '../types'
import { setChild } from '../utils/setters.ssr'

export const renderToString = (child: Child): string => {
    // Create a container for SSR
    const container = { children: '' }
    const stack = new Error()

    // Use a fragment for the root
    const fragment = FragmentUtils.make()

    // Set the child content
    setChild(container as any, child, fragment, stack)

    // Get the rendered content
    const children = FragmentUtils.getChildren(fragment)
    if (Array.isArray(children)) {
        return children.map(node => {
            if (typeof node === 'object' && node !== null) {
                if ('outerHTML' in node) {
                    return node.outerHTML
                } else if ('textContent' in node) {
                    return node.textContent
                }
            }
            return String(node)
        }).join('')
    } else {
        if (typeof children === 'object' && children !== null) {
            if ('outerHTML' in children) {
                return children.outerHTML
            } else if ('textContent' in children) {
                return children.textContent
            }
        }
        return String(children)
    }
}

export default renderToString