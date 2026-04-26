import { useRoot } from '../hooks/soby'
import { setChild } from '../utils/setters'
import type { Child, Disposer } from '../types'
import { FragmentUtils } from '../utils/fragment'


export const render = (child: Child, parent?: Element | null | ShadowRoot, options?: { append?: boolean }): Disposer => {
    if (!parent || !(parent instanceof HTMLElement || parent instanceof ShadowRoot)) throw new Error('Invalid parent node')

    return useRoot((dispose) => {
        if (!options?.append) {
            // Replace mode: clear existing content first
            parent.textContent = ''
        }

        // Track the fragment so dispose() can remove only our nodes (important for append mode)
        const fragment = FragmentUtils.make()
        setChild(parent, child, fragment)

        return (): void => {
            if (options?.append) {
                // Capture nodes BEFORE dispose tears down reactivity (which may clear fragment)
                const nodes = FragmentUtils.getChildrenFragmented(fragment)
                dispose()
                for (const node of nodes) {
                    try { parent.removeChild(node as Node) } catch { /* already removed */ }
                }
            } else {
                dispose()
                parent.textContent = ''
            }
        }

    })
}