import { FragmentUtils } from '../utils/fragment.ssr'
import type { Child } from '../types'
import { setChild } from '../utils/setters.ssr'
import { isArray } from '../utils/lang'
import { BaseNode } from './ssr.obj'
import { createHTMLNode } from '../utils/creators.ssr'

export const renderToString = (child: Child): string => {
    // Create a container for SSR using HTMLNode
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