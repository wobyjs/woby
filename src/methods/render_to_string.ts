import { FragmentUtils } from '../utils/fragment'
import type { Child } from '../types'
import { setChild } from '../utils/setters'
// import { isArray } from '../utils/lang'
import { BaseNode } from '../ssr/base_node'
// import { createHTMLNode as createHTMLNodeSSR } from '../ssr/document'
import { $$, context, resolve } from './soby'
import { SYMBOL_CLONE } from '../constants'
import { isFunction } from '../utils/lang'
import { EnvironmentContext, useEnvironment, showEnvLog, DocumentContext, useDocument } from '../components/environment_context'
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
    /**
     * If true, appends to existing content instead of replacing
     * Mirrors the append option in render()
     */
    append?: boolean
}

/**
 * Render HTML string from a Voby component or JSX element
 * 
 * For custom elements: renders only the host element tag (e.g., `<custom-element></custom-element>`)
 * without shadowRoot or slot content. This is intentional because:
 * 1. Custom elements are defined via `customElements.define()` with their own shadow DOM behavior
 * 2. The browser will automatically rebuild the shadowRoot and populate slots when the element is connected
 * 3. Including shadow DOM content in SSR would cause duplication and hydration mismatches
 * 4. The slot content is provided by light DOM children, which are rendered separately
 * 
 * TODO - renderToHtml -> which will render all customElement in div so it can be shown in browser without customElement defined in js
 * @param child 
 * @param options 
 * @returns 
 *  
 */
export function renderToString<T extends RenderToStringOptions = RenderToStringOptions>(
    child: Child,
    options?: T
): T extends { returnDocument: true } ? { html: string; document: SSRDocument } : string {
    const ssrDoc = options?.document ?? createDocument()

    // Provide BOTH environment AND document context for entire SSR duration
    return EnvironmentContext.Provider('ssr', () => {
        return DocumentContext.Provider(ssrDoc, () => {

            // If child is a component function (JSX.Element is a wrapped function), call it to initialize
            let resolvedChild: Child = child
            while (isFunction(resolvedChild)) {
                try {
                    // console.log('[renderToString] Calling component function, env:', useEnvironment())
                    const called = (resolvedChild as Function)()
                    // console.log('[renderToString] Component returned, env:', useEnvironment())
                    resolvedChild = called
                } catch (e: any) {
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

                // Flatten nested arrays and filter out null/undefined/boolean false
                const flattenAndFilter = (arr: any[]): any[] => {
                    const result: any[] = []
                    for (const item of arr) {
                        if (Array.isArray(item)) {
                            result.push(...flattenAndFilter(item))
                        } else if (item !== null && item !== undefined && item !== false) {
                            result.push(item)
                        }
                    }
                    return result
                }
                resolvedChild = flattenAndFilter(Array.isArray(resolvedChild) ? resolvedChild : [resolvedChild])
            }

            const stack = new Error()

            // Use a fragment for the root
            const fragment = FragmentUtils.make()

            if (options?.append) {
                // Append mode: render directly into ssrDoc.body so content is appended
                // This mirrors render(child, parent, { append: true }) which calls parent.append()
                setChild(ssrDoc.body, resolvedChild, fragment, stack)

                // Get the rendered content from ssrDoc.body children AND any extra body content (portals)
                const children = Array.from(ssrDoc.body.childNodes || [])
                const childrenContent = children.map((child: any) => getNodeContent(child)).join('')

                if (options?.returnDocument) {
                    return { html: childrenContent, document: ssrDoc }
                }

                return childrenContent
            }

            // Replace mode (default): render into a temp container (orphan div), extract HTML, discard container
            // Using a temp div (not appended to ssrDoc) keeps ssrDoc.body clean for portal content
            const container = ssrDoc.createElement('div')
            setChild(container, resolvedChild, fragment, stack)

            // Get the rendered content from the container's children AND document body (for portals)
            const children = Array.from(container.childNodes || [])
            const childrenContent = children.map((child: any) => {
                return getNodeContent(child)
            }).join('')

            // Include document body content for portals
            const bodyContent = ssrDoc.body?.innerHTML || ''

            // Return both html and document if requested
            if (options?.returnDocument) {
                return { html: childrenContent + bodyContent, document: ssrDoc }
            }

            return childrenContent + bodyContent
        }) as any
    }) as any
}

// Helper function to get content from node objects
export function getNodeContent(node: any): string {
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