import { FragmentUtils } from '../utils/fragment'
import type { Child } from '../types'
import { getSetters } from '../utils/setters'
import { BaseNode } from '../ssr/base_node'
import { getEnv } from '../utils/creators'

import { $$, resolve } from './soby'
import { SYMBOL_CLONE } from '../constants'
import { isFunction } from '../utils/lang'



export const renderToString = (child: Child): string => {
    console.log('=== RENDER_TO_STRING ENTRY POINT ===')
    console.log('renderToString called with child:', child)

    // Ensure SSR environment is propagated throughout
    const { setChild } = getSetters('ssr')
    const env = getEnv('ssr')

    // Create container for SSR - using proper SSR node creation
    const container = env.createHTMLNode('div')
    console.log('Created SSR container:', container)
    console.log('Container nodeType:', container?.nodeType)

    const stack = new Error()

    // Set child content with SSR environment propagation
    console.log('Setting child with SSR environment...')
    setChild(container, child, FragmentUtils.make(), stack)
    console.log('Container after setChild:', container)
    console.log('Container childNodes length:', container.childNodes?.length)
    if (container.childNodes && container.childNodes.length > 0) {
        const h1Element = container.childNodes[0]
        console.log('H1 element:', h1Element)
        console.log('H1 childNodes:', h1Element?.childNodes)
        if (h1Element?.childNodes) {
            h1Element.childNodes.forEach((child, index) => {
                console.log(`H1 child ${index}:`, child)
                console.log(`  nodeType:`, child?.nodeType)
                console.log(`  textContent:`, child?.textContent)
                console.log(`  toString:`, child?.toString?.())
            })
        }
    }

    // Get the rendered content from the container's children
    const children = Array.from(container.childNodes || [])
    console.log('Children to process:', children)
    const childrenContent = children.map((child: any) => {
        console.log('Processing child:', child)
        const content = getNodeContent(child)
        console.log('Child content:', content)
        return content
    }).join('')

    console.log('Final childrenContent:', childrenContent)
    return childrenContent
}

// Helper function to get content from node objects
function getNodeContent(node: any): string {
    console.log('getNodeContent called with node:', node)
    console.log('Node type:', typeof node)
    console.log('Node nodeType:', node?.nodeType)
    console.log('Node textContent:', node?.textContent)
    console.log('Node properties:', Object.keys(node || {}))

    // Handle null/undefined
    if (node === null || node === undefined) {
        console.log('Returning empty string for null/undefined')
        return ''
    }

    // Handle primitive types
    if (typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
        console.log('Returning string for primitive:', String(node))
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
        // Check for text nodes first
        if (node.nodeType === 3 && 'textContent' in node) {
            return node.textContent
        }

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
            return `<${(node as any).tagName}${attrStr} />`
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
