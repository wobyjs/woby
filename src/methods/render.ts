

import { useRoot } from '../hooks/soby'
import { setChild } from '../utils/setters'
import type { Child, Disposer } from '../types'
import { FragmentUtils } from '../utils/fragment'


export const render = (child: Child, parent?: Element | null): Disposer => {

    if (!parent || !(parent instanceof HTMLElement)) throw new Error('Invalid parent node')

    parent.textContent = ''

    return useRoot((stack, dispose) => {

        setChild(parent, child, FragmentUtils.make(), stack)

        return (): void => {

            dispose(stack)

            parent.textContent = ''

        }

    })

}
