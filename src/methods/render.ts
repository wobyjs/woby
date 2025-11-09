import { isSSR } from '../constants'
import { useRoot } from '../hooks/soby'
import { setChild } from '../utils/setters'
import { setChild as setChildSSR } from '../utils/setters.ssr'
import type { Child, Disposer } from '../types'
import { FragmentUtils } from '../utils/fragment'
import { FragmentUtils as FragmentUtilsSSR } from '../utils/fragment.ssr'


export const render = (child: Child, parent?: Element | null | ShadowRoot): Disposer => {

    // Use different logic based on SSR mode
    if (isSSR) {
        // SSR-specific logic (only one parameter)
        if (!parent || !('textContent' in parent)) throw new Error('Invalid parent node')

        // if (!(parent instanceof ShadowRoot))
        parent.textContent = ''

        return useRoot((stack, dispose) => {

            setChildSSR(parent as any, child, FragmentUtilsSSR.make(), stack)

            return (): void => {

                dispose(stack);

                (parent as any).textContent = ''

            }

        })
    } else {
        // Browser-specific logic (two parameters)
        if (!parent || !(parent instanceof HTMLElement || parent instanceof ShadowRoot)) throw new Error('Invalid parent node')

        // if (!(parent instanceof ShadowRoot))
        parent.textContent = ''

        return useRoot((stack, dispose) => {

            setChild(parent, child, FragmentUtils.make(), stack)

            return (): void => {

                dispose(stack)

                parent.textContent = ''

            }

        })
    }
}