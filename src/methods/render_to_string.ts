import { FragmentUtils } from '../utils/fragment'
import type { Child } from '../types'
import { setChild } from '../utils/setters'
// import { isArray } from '../utils/lang'
import { BaseNode } from '../ssr/base_node'
import { createHTMLNode as createHTMLNodeSSR } from '../utils/creators.ssr'
import { $$, context, resolve } from './soby'
import { SYMBOL_CLONE } from '../constants'
import { isFunction } from '../utils/lang'
import { EnvironmentContext, useEnvironment, showEnvLog } from '../components/environment_context'
import type { SSRDocument } from '../ssr/document'
import { createDocument } from '../ssr/document'

/**
 * Options for renderToString
 */
export interface RenderToStringOptions {
    /**
     * Custom SSR document instance for isolated context
     * If not provided, a new document instance will be created internally
     */
    document?: SSRDocument
    /**
     * If true, returns both HTML string and document instance
     * Useful for inspecting what was rendered to document.body (e.g., portals)
     */
    returnDocument?: boolean
}

export const renderToString = (
    child: Child,
    options?: RenderToStringOptions
): string | { html: string; document: SSRDocument } => {
    console.log('[renderToString] Called with:', {
        childType: typeof child,
        hasOptions: !!options,
        options: options ? {
            hasDocument: !!options.document,
            returnDocument: options.returnDocument
        } : undefined
    })

    return EnvironmentContext.Provider('ssr', () => {
        // Create or use provided document instance for isolated context
        const ssrDoc = options?.document ?? createDocument()
        console.log('[renderToString] Using document:', ssrDoc ? 'custom/provided' : 'new instance')

        if (showEnvLog)
            console.log('ENV renderToString:', useEnvironment())

        // Use document's createElement for container creation
        const container = ssrDoc.createElement('div')
        console.log('[renderToString] Created container:', container.tagName || 'div')
        const stack = new Error()

        // Use a fragment for the root
        const fragment = FragmentUtils.make()
        console.log('[renderToString] Created fragment')

        // Set the child content
        console.log('[renderToString] About to setChild with child type:', typeof child)
        setChild(container, child, fragment, stack)
        console.log('[renderToString] setChild completed, childNodes count:', container.childNodes?.length || 0)

        // Get the rendered content from the container's children
        const children = Array.from(container.childNodes || [])
        const childrenContent = children.map((child: any) => {
            return getNodeContent(child)
        }).join('')
        console.log('[renderToString] Generated HTML content length:', childrenContent.length)

        // Return both html and document if requested
        if (options?.returnDocument) {
            console.log('[renderToString] Returning object with html and document')
            return { html: childrenContent, document: ssrDoc }
        }

        console.log('[renderToString] Returning HTML string')
        return childrenContent
    }) as any
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
        if (tagName.toLowerCase() === 'p' && node.childNodes && node.childNodes.length > 0) {
            // Simply concatenate all child text content
            const textContent = node.childNodes
                .map((child: any) => {
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
            return getNodeContent(child)
        }).join('')

        return `<${tagName.toLowerCase()}${attrStr}>${childrenContent}</${tagName.toLowerCase()}>`
    }

    // Default case
    return String(node)
}