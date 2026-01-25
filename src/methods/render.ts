import { useRoot } from '../hooks/soby'
import { getSetters } from '../utils/setters'
import type { Child, Disposer } from '../types'
import { FragmentUtils } from '../utils/fragment'


export const render = (child: Child, parent?: Element | null | ShadowRoot): Disposer => {
    const { setChild } = getSetters()

    if (!parent || !(parent instanceof HTMLElement || parent instanceof ShadowRoot)) throw new Error('Invalid parent node')

    // if (!(parent instanceof ShadowRoot))
    parent.textContent = ''

    return useRoot((options, dispose) => {

        setChild(parent, child, FragmentUtils.make(), options.stack!)

        return (): void => {

            dispose(options)

            parent.textContent = ''

        }

    })
}