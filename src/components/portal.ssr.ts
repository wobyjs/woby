
import { useBoolean } from '../hooks/soby'
import { useRenderEffect } from '../hooks/use_render_effect'
import { render } from '../methods/render.ssr'
import { $$ } from '../methods/soby'
import { createHTMLNode } from '../utils/creators.ssr'
import { assign } from '../utils/lang'
import type { Child, ChildWithMetadata, FunctionMaybe } from '../types'

export const Portal = ({ when = true, mount, wrapper, children }: { mount?: Child, when?: FunctionMaybe<boolean>, wrapper?: Child, children?: Child }): ChildWithMetadata<{ portal: HTMLElement }> => {

    const portal = $$(wrapper) || createHTMLNode('div')

    if (!('appendChild' in (portal as HTMLElement))) throw new Error('Invalid wrapper node')

    const condition = useBoolean(when)

    const stack = new Error()

    useRenderEffect(() => {

        if (!$$(condition)) return

        const parent: HTMLElement = $$(mount) as any || createHTMLNode('div')

        if (!('appendChild' in (parent as HTMLElement))) throw new Error('Invalid mount node')

        parent.insertBefore(portal as any, null)

        return (): void => {

            parent.removeChild(portal as any)

        }

    }, stack)

    useRenderEffect(() => {

        if (!$$(condition)) return

        return render(children/* , portal */)

    }, stack)

    return assign(() => $$(condition) || children, { metadata: { portal } }) as any

}
