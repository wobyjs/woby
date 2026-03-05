import { useBoolean } from '../hooks/soby'
import { useRenderEffect } from '../hooks/use_render_effect'
import { render } from '../methods/render'
import { $$ } from '../methods/soby'
import { createHTMLNode as createHTMLNodeDOM } from '../utils/creators'
import { createHTMLNode as createHTMLNodeSSR } from '../utils/creators.ssr'
import { assign } from '../utils/lang'
import type { Child, ChildWithMetadata, FunctionMaybe } from '../types'
import { useEnvironment } from '../components/environment_context'
import { setChild } from '../utils/setters'
import { FragmentUtils } from '../utils/fragment'


export const Portal = ({ when = true, mount, wrapper, children }: { mount?: Child, when?: FunctionMaybe<boolean>, wrapper?: Child, children?: Child }): ChildWithMetadata<{ portal: HTMLElement }> => {
    console.log('[Portal] Called with:', {
        when,
        hasMount: !!mount,
        hasWrapper: !!wrapper,
        hasChildren: !!children
    })

    const isSSR = useEnvironment() === 'ssr'
    console.log('[Portal] Environment:', isSSR ? 'SSR' : 'Browser')

    const createHTMLNode = isSSR ? createHTMLNodeSSR : createHTMLNodeDOM
    const portal = $$(wrapper) || createHTMLNode('div')
    console.log('[Portal] Created portal wrapper:', (portal as any).tagName || 'div')

    // Use different validation based on environment
    if (isSSR) {
        if (!('appendChild' in (portal as HTMLElement))) throw new Error('Invalid wrapper node')
        console.log('[Portal] SSR validation passed for wrapper')
    } else {
        if (!(portal instanceof HTMLElement)) throw new Error('Invalid wrapper node')
        console.log('[Portal] Browser validation passed for wrapper')
    }

    const condition = useBoolean(when)
    console.log('[Portal] Condition value:', $$(condition))

    const stack = new Error()

    if (!isSSR) {
        console.log('[Portal] Executing BROWSER mode code')
        useRenderEffect(() => {

            if (!$$(condition)) {
                console.log('[Portal] Condition is false, skipping render')
                return
            }

            // Use different parent selection based on environment
            const parent: any = ($$(mount) || document.body)
            console.log('[Portal] Browser mode - parent:', parent.tagName || 'body')

            // Use different validation based on environment
            if (isSSR) {
                if (!('appendChild' in (parent as HTMLElement))) throw new Error('Invalid mount node')
            } else {
                if (!(parent instanceof Element)) throw new Error('Invalid mount node')
            }

            parent.insertBefore(portal, null)
            console.log('[Portal] Inserted portal into parent')

            return (): void => {
                console.log('[Portal] Cleanup: removing portal from parent')
                parent.removeChild(portal)
            }

        }, stack)

        useRenderEffect(() => {

            if (!$$(condition)) {
                console.log('[Portal] Condition is false, skipping children render')
                return
            }

            // In SSR mode, we don't pass the portal to avoid issues
            console.log('[Portal] Rendering children to portal')
            render(children, portal as Element)

        }, stack)
    }
    else {
        console.log('[Portal] Executing SSR mode code')
        const parent: any = ($$(mount) as any || createHTMLNode('div'))
        console.log('[Portal] SSR mode - parent:', parent.tagName || 'div')
        setChild(parent, children, FragmentUtils.make(), stack)
        console.log('[Portal] SSR setChild completed')

        // Attach the parent to document body so it's included in SSR output
        if (mount) {
            console.log('[Portal] Attaching mounted parent to document body')
            const doc = (globalThis as any).document || document
            doc.body.appendChild(parent)
        }

        // renderToString(parent) // render on callee
    }

    console.log('[Portal] Returning portal component')
    return assign(() => $$(condition) || children, { metadata: { portal: portal as HTMLElement } })
}