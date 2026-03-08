import { FragmentUtils } from '../utils/fragment'
import type { Child } from '../types'
import { setChild } from '../utils/setters'
// import { isArray } from '../utils/lang'
import { BaseNode } from '../ssr/base_node'
// import { createHTMLNode as createHTMLNodeSSR } from '../ssr/document'
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
    return EnvironmentContext.Provider('ssr', () => {
        // Create or use provided document instance for isolated context
        const ssrDoc = options?.document ?? createDocument()

        // If child is a component function (JSX.Element is a wrapped function), call it to initialize
        let resolvedChild: Child = child
        while (isFunction(resolvedChild)) {
            try {
                const called = (resolvedChild as Function)()
                resolvedChild = called
            } catch (e) {
                break
            }
        }

        // If result is an array, recursively resolve each element
        if (Array.isArray(resolvedChild)) {
            const resolveDeep = (item: any): any => {
                let resolved = item
                while (isFunction(resolved)) {
                    resolved = (resolved as Function)()
                }
                // If still an array after unwrapping, resolve its elements too
                if (Array.isArray(resolved)) {
                    return resolved.map(resolveDeep)
                }
                return resolved
            }
            resolvedChild = resolvedChild.map(resolveDeep)
        }

        // Use document's createElement for container creation
        const container = ssrDoc.createElement('div')
        const stack = new Error()

        // Use a fragment for the root
        const fragment = FragmentUtils.make()

        // Set the child content
        setChild(container, resolvedChild, fragment, stack)

        // Get the rendered content from the container's children
        const children = Array.from(container.childNodes || [])
        const childrenContent = children.map((child: any) => {
            return getNodeContent(child)
        }).join('')

        // Return both html and document if requested
        if (options?.returnDocument) {
            return { html: childrenContent, document: ssrDoc }
        }

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
    // Check for outerHTML property first (SSRCustomElement has this)
    if ('outerHTML' in node && typeof node.outerHTML === 'string') {
        return node.outerHTML
    }

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
            .map(([name, value]) => {
                // Convert htmlFor to for for HTML compliance
                const attrName = name.toLowerCase() === 'htmlfor' ? 'for' : name
                return `${attrName}="${value}"`
            })
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