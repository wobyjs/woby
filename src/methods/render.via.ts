import { useRoot } from '../hooks/soby'
import { setChild } from '../utils/setters.via'
import type { Child, Disposer } from '../types'

export const render = (child: Child, parent?: Element | null): Disposer => {

    if (!parent || !(parent instanceof HTMLElement)) throw new Error('Invalid parent node')

    parent.textContent = ''

    return useRoot((dispose) => {

        setChild(parent, child)

        return (): void => {

            dispose()

            parent.textContent = ''

        }

    })

}


