import { FragmentUtils } from '../utils/fragment'
import type { Child } from '../types'
import { setChild } from '../utils/setters'
// import { isArray } from '../utils/lang'
import { BaseNode } from '../ssr/base_node'
import { createHTMLNode } from '../utils/creators.ssr'
import { $$, context, resolve } from './soby'
import { SYMBOL_CLONE } from '../constants'
import { isFunction } from '../utils/lang'
import { EnvironmentContext, useEnvironment, showEnvLog } from '../components/environment_context'

export const renderToString = (child: Child): string => {
    return EnvironmentContext.Provider('ssr', () => {
        if (showEnvLog)
            console.log('ENV renderToString:', useEnvironment())
        // Create a container for SSR using HTMLNode
        const container = createHTMLNode('div')
        const stack = new Error()

        console.log('renderToString START')
        console.log('renderToString child:', child)
        // Use a fragment for the root
        const fragment = FragmentUtils.make()

        console.log('renderToString calling setChild with container:', container, 'fragment:', fragment)
        // Set the child content
        setChild(container, child, fragment, stack)

        console.log('renderToString after setChild - container.childNodes:', container.childNodes)
        console.log('renderToString container.childNodes.length:', container.childNodes?.length)
        const details = Array.from(container.childNodes || []).map((c: any) => ({ tagName: c.tagName, nodeType: c.nodeType, textContent: c.textContent, childNodesLength: c.childNodes?.length }))
        console.log('renderToString details count:', details.length)
        // Get the rendered content from the container's children
        const children = Array.from(container.childNodes || [])
        const childrenContent = children.map((child: any) => {
            return getNodeContent(child)
        }).join('')

        return childrenContent
    }) as string
}

// Helper function to get content from node objects
function getNodeContent(node: any): string {
    console.log('[getNodeContent] node:', (node as any)?.tagName || node?.nodeType, 'childNodes:', node?.childNodes?.length)
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
        console.log('[getNodeContent] FUNCTION detected:', node.name || 'anonymous')
        // Handle component functions with SYMBOL_CLONE
        if (SYMBOL_CLONE in node) {
            console.log('[getNodeContent] SYMBOL_CLONE found - executing component')
            // Check if props have SYMBOL_JSX

            // Execute the component function and resolve the result
            const result = resolve(node)
            console.log('[getNodeContent] resolve result:', result)
            return getNodeContent(result)
        }

        // Handle observables
        const unwrapped = $$(node)
        return getNodeContent(unwrapped)
    }

    // Handle objects
    if (typeof node === 'object') {
        // Handle BaseNode objects first (more specific)
        if (node instanceof BaseNode) {
            return constructNodeHTML(node)
        }

        // Check for outerHTML property (HTMLNode, SVGNode, etc.)
        if ('outerHTML' in node) {
            return node.outerHTML
        }

        // Check for textContent property (Text nodes)
        if ('textContent' in node) {
            return node.textContent
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
            const textContent = (node as any).textContent || ''
            return textContent
        }
        // Fallback for BaseNode text nodes
        const fallbackText = node.childNodes && node.childNodes.length > 0 ? String(node.childNodes[0]) : ''
        return fallbackText
    } else if (node.nodeType === 8) {
        // Comment node - check if it has textContent property
        if ('textContent' in node) {
            return `<!--${(node as any).textContent || ''}-->`
        }
        // Fallback for BaseNode comment nodes
        return `<!---->`
    } else if (node.nodeType === 1) {
        // Element node - check if it has tagName property (HTMLNode or SVGNode)
        const tagName = ('tagName' in node) ? (node as any).tagName.toLowerCase() : 'div'

        // Build attributes string
        const attrs = Object.entries(node.attributes || {})
            .map(([name, value]) => `${name}="${value}"`)
            .join(' ')
        const attrStr = attrs ? ` ${attrs}` : ''

        // Handle self-closing tags
        const selfClosingTags = ['BR', 'HR', 'IMG', 'INPUT', 'META', 'LINK']
        if (('tagName' in node) && selfClosingTags.includes((node as any).tagName.toLowerCase())) {
            return `<${(node as any).tagName.toLowerCase()}${attrStr}>`
        }

        // Special handling for P elements to ensure proper text content concatenation
        console.log('[render_to_string] Processing element:', tagName, 'childNodes:', node.childNodes?.length)
        if (tagName.toLowerCase() === 'p' && node.childNodes && node.childNodes.length > 0) {
            console.log('[P element in render_to_string] childNodes:', node.childNodes.length)
            node.childNodes.forEach((child: any, i: number) => {
                console.log(`[P element] child ${i}:`, { nodeType: child.nodeType, textContent: child.textContent, value: child.valueOf?.() })
            })
            // Simply concatenate all child text content
            const textContent = node.childNodes
                .map((child: any) => {
                    console.log('[P element] Processing child:', { nodeType: child.nodeType, tagName: child.tagName, textContent: child.textContent, isFragment: child.values !== undefined })
                    if (child.nodeType === 3) {
                        // Text node
                        return child.textContent || String(child)
                    } else if (typeof child === 'object' && 'textContent' in child) {
                        // Object with textContent
                        return child.textContent || ''
                    } else {
                        // Other content
                        return getNodeContent(child)
                    }
                })
                .join('')

            return `<${tagName.toLowerCase()}${attrStr}>${textContent}</${tagName.toLowerCase()}>`
        }

        // Default handling for other elements
        const childrenContent = (node.childNodes || []).map((child: any) => {
            const result = getNodeContent(child)
            console.log('Child result:', result)
            return result
        }).join('')

        return `<${tagName.toLowerCase()}${attrStr}>${childrenContent}</${tagName.toLowerCase()}>`
    }

    // Default case
    return String(node)
}