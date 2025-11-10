
import { setChild } from '../utils/setters.ssr'
import { FragmentUtils } from '../utils/fragment.ssr'
import type { Child, Disposer } from '../types'
import { useRoot } from '../hooks/soby'


export const render = (child: Child)/* : string */ => {

    if (!parent || !('textContent' in parent)) throw new Error('Invalid parent node')

    // if (!(parent instanceof ShadowRoot))
    parent.textContent = ''

    return useRoot((stack, dispose) => {

        setChild(parent as any, child, FragmentUtils.make(), stack)

        return (): void => {

            dispose(stack);

            (parent as any).textContent = ''

        }

    })

    // // Create a container for SSR
    // const container = { children: '' }
    // const stack = new Error()

    // // Use a fragment for the root
    // const fragment = FragmentUtils.make()

    // // Set the child content
    // setChild(container as any, child, fragment, stack)

    // // Get the rendered content
    // const children = FragmentUtils.getChildren(fragment)
    // if (isArray(children)) {
    //     return children.map(node => (node as any).outerHTML || (node as any).textContent || node.toString()).join('')
    // } else {
    //     return (children as any).outerHTML || (children as any).textContent || children.toString()
    // }
}

