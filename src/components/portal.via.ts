
import { useBoolean } from '../hooks/soby'
import { useRenderEffect } from '../hooks/use_render_effect'
import { render } from '../methods/render.via'
import { $$ } from '../methods/soby'
import { createHTMLNode } from '../utils/creators.via'
import { assign } from '../utils/lang'
import type { Child, ChildWithMetadata, FunctionMaybe } from '../types'

export const Portal = ({ when = true, mount, wrapper, children }: { mount?: Child, when?: FunctionMaybe<boolean>, wrapper?: Child, children: Child }): ChildWithMetadata<{ portal: HTMLElement }> => {

  const portal = $$(wrapper) || createHTMLNode('div')

  if (!(portal instanceof HTMLElement)) throw new Error('Invalid wrapper node')

  const condition = useBoolean(when)

  const stack = new Error()

  useRenderEffect(() => {

    if (!$$(condition)) return

    const parent = $$(mount) || document.body

    if (!(parent instanceof Element)) throw new Error('Invalid mount node')

    parent.insertBefore(portal, null)

    return (): void => {

      parent.removeChild(portal)

    }

  }, stack)

  useRenderEffect(() => {

    if (!$$(condition)) return

    return render(children, portal)

  }, stack)

  return assign(() => $$(condition) || children, { metadata: { portal } })

}
