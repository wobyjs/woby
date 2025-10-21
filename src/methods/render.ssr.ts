
import { setChild } from '../utils/setters.ssr'
import type { Child } from '../types'
import { FragmentUtils } from '../utils/fragment.ssr'
import { isArray } from '../utils'


export const render = (child: Child): string => {
    // Create a container for SSR
    const container = { children: '' }
    const stack = new Error()

    // Use a fragment for the root
    const fragment = FragmentUtils.make()

    // Set the child content
    setChild(container as any, child, fragment, stack)

    // Get the rendered content
    const children = FragmentUtils.getChildren(fragment)
    if (isArray(children)) {
        return children.map(node => (node as any).outerHTML || (node as any).textContent || node.toString()).join('')
    } else {
        return (children as any).outerHTML || (children as any).textContent || children.toString()
    }
}

