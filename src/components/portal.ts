import { isSSR } from '../constants'
import { useBoolean } from '../hooks/soby'
import { useRenderEffect } from '../hooks/use_render_effect'
import { render } from '../methods/render'
import { $$ } from '../methods/soby'
import { createHTMLNode } from '../utils/creators'
import { createHTMLNode as createHTMLNodeSSR } from '../utils/creators.ssr'
import { assign } from '../utils/lang'
import type { Child, ChildWithMetadata, FunctionMaybe } from '../types'


export const Portal = ({ when = true, mount, wrapper, children }: { mount?: Child, when?: FunctionMaybe<boolean>, wrapper?: Child, children?: Child }): ChildWithMetadata<{ portal: HTMLElement }> => {

    const portal = $$(wrapper) || (isSSR ? createHTMLNodeSSR('div') : createHTMLNode('div'))

    // Use different validation based on environment
    if (isSSR) {
        if (!('appendChild' in (portal as HTMLElement))) throw new Error('Invalid wrapper node')
    } else {
        if (!(portal instanceof HTMLElement)) throw new Error('Invalid wrapper node')
    }

    const condition = useBoolean(when)

    const stack = new Error()

    useRenderEffect(() => {

        if (!$$(condition)) return

        // Use different parent selection based on environment
        const parent: any = isSSR ?
            ($$(mount) as any || createHTMLNodeSSR('div')) :
            ($$(mount) || document.body)

        // Use different validation based on environment
        if (isSSR) {
            if (!('appendChild' in (parent as HTMLElement))) throw new Error('Invalid mount node')
        } else {
            if (!(parent instanceof Element)) throw new Error('Invalid mount node')
        }

        parent.insertBefore(portal, null)

        return (): void => {

            parent.removeChild(portal)

        }

    }, stack)

    useRenderEffect(() => {

        if (!$$(condition)) return

        // In SSR mode, we don't pass the portal to avoid issues
        return isSSR ? render(children, null) : render(children, portal as Element)

    }, stack)

    return assign(() => $$(condition) || children, { metadata: { portal: portal as HTMLElement } })

}