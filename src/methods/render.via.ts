import { useRoot } from '../hooks/soby'
import { getSetters } from '../utils/setters.via'
const { setChild } = getSetters('via')
import type { Child, Disposer } from '../types'

export const render = (child: Child, parent?: Element | null): Disposer => {

    if (!parent || !(parent instanceof HTMLElement)) throw new Error('Invalid parent node')

    parent.textContent = ''

    return useRoot((options, dispose) => {

        setChild(parent, child, options.stack!)

        return (): void => {

            dispose(options)

            parent.textContent = ''

        }

    })

}


