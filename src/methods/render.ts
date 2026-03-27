import { useEffect, useRoot } from '../hooks/soby'
import { setChild } from '../utils/setters'
import type { Child, Disposer } from '../types'
import { FragmentUtils } from '../utils/fragment'
import { resolveChild } from '../utils/resolvers'
import { isFunction, isFunctionReactive } from '../utils'
import { $$ } from './soby'


export const render = (child: Child, parent?: Element | null | ShadowRoot, options?: { append?: boolean }): Disposer => {
    if (!parent || !(parent instanceof HTMLElement || parent instanceof ShadowRoot)) throw new Error('Invalid parent node')

    let node: HTMLElement | null = null

    return useRoot((stack, dispose) => {
        if (options?.append) {
            // Append mode: don't clear existing content
            if (isFunction(child) && isFunctionReactive(child))
                useEffect(() => parent.append(node = $$(child) as HTMLElement))
            else
                parent.append(node = $$(child) as HTMLElement)
        } else {
            // Replace mode: clear content first
            parent.textContent = ''
            setChild(parent, child, FragmentUtils.make(), stack)
        }

        return (): void => {

            dispose(stack)

            if (options?.append)
                parent.removeChild(node!)
            else
                parent.textContent = ''

        }

    })
}