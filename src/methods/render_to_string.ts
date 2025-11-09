import { Portal } from '../components/portal'
import { SuspenseCollector } from '../components/suspense.collector'
import { useEffect } from '../hooks/soby'
import { useRoot } from '../hooks/soby'
import { $$ } from '../methods/soby'
import type { Child } from '../types'
import { FragmentUtils } from '../utils/fragment'
import { FragmentUtils as FragmentUtilsSSR } from '../utils/fragment.ssr'
import { setChild } from '../utils/setters'
import { setChild as setChildSSR } from '../utils/setters.ssr'
import { isArray } from '../utils/lang'
import { BaseNode } from './ssr.obj'
import { createHTMLNode } from '../utils/creators'
import { createHTMLNode as createHTMLNodeSSR } from '../utils/creators.ssr'
import { resolve } from '../methods/soby'
import { SYMBOL_CLONE } from '../constants'
import { isFunction } from '../utils/lang'
import { isSSR } from '../constants'


//TODO: Implement this properly, without relying on JSDOM or stuff like that

export const renderToString = (child: Child): string => {
    // Use different logic based on SSR mode
    if (isSSR) {
        // SSR-specific logic
        // Create a container for SSR using HTMLNode
        const container = createHTMLNodeSSR('div')
        const stack = new Error()

        // Use a fragment for the root
        const fragment = FragmentUtilsSSR.make()

        // Set the child content
        setChildSSR(container, child, fragment, stack)

        // Get the rendered content from the container's children
        const children = Array.from(container.childNodes || [])
        const childrenContent = children.map((child: any) => {
            return getNodeContent(child)
        }).join('')

        return childrenContent
    } else {
        // Browser-specific logic
        // Create a container for browser using HTMLNode
        const container = createHTMLNode('div')
        const stack = new Error()

        // Use a fragment for the root
        const fragment = FragmentUtils.make()

        // Set the child content
        setChild(container, child, fragment, stack)

        // Get the rendered content from the container's children
        const children = Array.from(container.childNodes || [])
        const childrenContent = children.map((child: any) => {
            return getNodeContent(child)
        }).join('')

        return childrenContent
    }
}

// Helper function to get content from node objects
function getNodeContent(node: any): string {
    // Handle null/undefined
    if (node === null || node === undefined) {
        return ''
    }

    // Handle primitive types
    if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
        return String(node)
    }

    // Handle functions (component functions or observables)
    if (isFunction(node)) {
        // Handle component functions with SYMBOL_CLONE
        if (SYMBOL_CLONE in node) {
            // Check if props have SYMBOL_JSX

            // Execute the component function and resolve the result
            const result = resolve(node)
            return getNodeContent(result)
        }

        // Handle observables
        const unwrapped = $$(node)
        return getNodeContent(unwrapped)
    }

    // Handle objects
    if (typeof node === 'object') {
        // Check for outerHTML property (HTMLNode, SVGNode, etc.)
        if ('outerHTML' in node) {
            return node.outerHTML
        }

        // Check for textContent property (Text nodes)
        if ('textContent' in node) {
            return node.textContent
        }

        // Handle BaseNode objects
        if (node instanceof BaseNode) {
            return constructNodeHTML(node)
        }

        // Handle arrays
        if (Array.isArray(node)) {
            return node.map(getNodeContent).join('')
        }
    }

    // Default case
    return String(node)
}

// Helper function to construct HTML from BaseNode
function constructNodeHTML(node: BaseNode): string {
    // Handle different node types
    if (node.nodeType === 3) {
        // Text node - check if it has textContent property
        if ('textContent' in node) {
            return (node as any).textContent || ''
        }
        // Fallback for BaseNode text nodes
        return node.childNodes && node.childNodes.length > 0 ? String(node.childNodes[0]) : ''
    } else if (node.nodeType === 8) {
        // Comment node - check if it has textContent property
        if ('textContent' in node) {
            return `<!--${(node as any).textContent || ''}-->`
        }
        // Fallback for BaseNode comment nodes
        return `<!---->`
    } else if (node.nodeType === 1) {
        // Element node - check if it has tagName property (HTMLNode or SVGNode)
        const tagName = ('tagName' in node) ? (node as any).tagName : 'div'

        // Build attributes string
        const attrs = Object.entries(node.attributes || {})
            .map(([name, value]) => `${name}="${value}"`)
            .join(' ')
        const attrStr = attrs ? ` ${attrs}` : ''

        // Handle self-closing tags
        const selfClosingTags = ['BR', 'HR', 'IMG', 'INPUT', 'META', 'LINK']
        if (('tagName' in node) && selfClosingTags.includes((node as any).tagName.toUpperCase())) {
            return `<${(node as any).tagName}${attrStr}>`
        }

        // Build children string
        const childrenContent = (node.childNodes || []).map((child: any) => {
            return getNodeContent(child)
        }).join('')

        return `<${tagName}${attrStr}>${childrenContent}</${tagName}>`
    }

    // Default case
    return String(node)
}

export const renderToStringOri = (child: Child)/* : Promise<string>  */ => {

  return new Promise(resolve => {

    useRoot((stack, dispose) => {

      $$(SuspenseCollector.wrap(suspenses => {

        const { portal } = Portal({ children: child }).metadata

        useEffect((stack) => {

          if (suspenses.active()) return

          resolve(portal.innerHTML)

          dispose(stack)

        }, { suspense: false, stack: stack })

      }))

    })

  })

}