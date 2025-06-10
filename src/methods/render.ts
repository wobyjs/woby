
/* IMPORT */

import useRoot from '../hooks/use_root'
import { setChild } from '../utils/setters'
import type { Child, Disposer } from '../types'
import FragmentUtils from '../utils/fragment'

/* MAIN */

const render = (child: Child, parent?: Element | null): Disposer => {

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

/* EXPORT */

export default render
