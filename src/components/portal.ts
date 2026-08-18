import { useBoolean } from '../hooks/soby'
import { useRenderEffect } from '../hooks/use_render_effect'
import { render } from '../methods/render'
import { $$ } from '../methods/soby'
import { createHTMLNode as createHTMLNodeDOM } from '../utils/creators'
import { createDocument, createHTMLNode as createHTMLNodeSSR } from '../ssr'
import { assign } from '../utils/lang'
import type { Child, ChildWithMetadata, FunctionMaybe } from '../types'
import { useDocument, useEnvironment } from '../components/environment_context'
import { setChild } from '../utils/setters'
import { FragmentUtils } from '../utils/fragment'


export const Portal = ({ when = true, mount, wrapper, children }: { mount?: Child, when?: FunctionMaybe<boolean>, wrapper?: Child, children?: Child }): ChildWithMetadata<{ portal: HTMLElement }> => {
    const isSSR = useEnvironment() === 'ssr'

    const createHTMLNode = isSSR ? createHTMLNodeSSR : createHTMLNodeDOM
    const portal = $$(wrapper) || createHTMLNode('div')

    // Use different validation based on environment
    if (isSSR) {
        if (!('appendChild' in (portal as HTMLElement))) throw new Error('Invalid wrapper node')
    } else {
        if (!(portal instanceof HTMLElement)) throw new Error('Invalid wrapper node')
    }

    const condition = useBoolean(when)

    const stack = new Error()

    if (!isSSR) {
        useRenderEffect(() => {

            if (!$$(condition)) return

            // Use different parent selection based on environment
            const parent: any = ($$(mount) || document.body)

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
            const disposeRender = render(children, portal as Element)

            return (): void => {
                if (disposeRender) disposeRender()
            }

        }, stack)
    }
    else {
        // SSR mode: render children directly to parent
        const ssrDoc = useDocument()
        let mountNode = $$(mount) as any

        // In SSR context with DocumentContext, redirect global document.body to
        // the context-provided document's body so renderToString can find portal content
        if (ssrDoc && mountNode === globalThis.document?.body) {
            mountNode = ssrDoc.body
        }

        // Mirroring the DOM branch's `$$(mount) || document.body`: with no explicit mount the
        // children belong to the document body, otherwise they'd be rendered into an orphan
        // node and silently dropped from the output.
        const parent: any = mountNode || (ssrDoc ?? createDocument()).body

        if (wrapper) {
            // If wrapper is provided, use it
            let portal: any = $$(wrapper)
            // Unwrap if it's a function
            while (typeof portal === 'function') {
                portal = portal()
            }

            // Render children to the portal element
            setChild(portal, children, FragmentUtils.make(), stack)

            // Append the portal (with children) to the parent
            parent.appendChild(portal)
        } else {
            // No wrapper - render children directly to parent
            setChild(parent, children, FragmentUtils.make(), stack)
        }

        // NOTE: an explicitly-provided mount is the caller's own node and is never re-parented
        // into the document. If it is detached, its content is correctly absent from the
        // rendered string — same as portalling into a detached container in the DOM renderer.
    }

    return assign(() => $$(condition) || children, { metadata: { portal: portal as HTMLElement } })
}