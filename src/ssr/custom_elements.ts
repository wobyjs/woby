/**
 * Mock customElements object for SSR
 */

import type { Component } from "../types"
import { Element } from './element'
import { renderToString } from '../methods/render_to_string'

// Simple dictionary to store custom element definitions in SSR environment
const customElementsRegistry: Map<string, any> = new Map()

export const customElements = {
    define: (tagName: string, component: any) => {
        customElementsRegistry.set(tagName, component)
    },

    get: (tagName: string) => {
        return customElementsRegistry.get(tagName)
    },

    whenDefined: async (tagName: string) => {
        // In SSR, we just return a resolved promise since all components are already defined
        return Promise.resolve()
    }
}

/**
 * SSRCustomElement class for server-side rendering
 * Extends Element to provide custom element functionality with shadow DOM and slot support
 */
export class SSRCustomElement extends Element {
    static __component__: Component<any>
    public props: any
    public childNodes: any[]
    public shadowRoot: SSRShadowRoot | null = null
    public slots: any[] = []

    constructor(tagName: string, props?: any) {
        super(tagName)
        console.log('[SSRCustomElement]: ', tagName)
        // Get the component function
        const componentFn = (this.constructor as any).__component__

        // Store provided props
        this.props = props || {}

        // Execute component and render children if component exists
        if (componentFn && typeof componentFn === 'function') {
            try {
                // Call component with props to get JSX result
                const jsxResult = componentFn.call(null, this.props)

                // For SSR, we need to resolve the JSX.Element to actual nodes
                // The jsxResult is typically a function wrapper (JSX.Element)
                // We'll store it in childNodes to be resolved later by outerHTML
                this.childNodes = [jsxResult]
            } catch (e) {
                console.error('[SSRCustomElement] Failed to execute component:', e)
                this.childNodes = []
            }
        } else {
            // No component function, just use children from props if available
            if (props && (props as any).children) {
                const children = (props as any).children
                this.childNodes = Array.isArray(children) ? children : [children]
            } else {
                this.childNodes = []
            }
        }
    }

    /**
     * Attach a shadow root to the custom element
     */
    attachShadow(options: { mode: string; serializable?: boolean }) {
        this.shadowRoot = new SSRShadowRoot(this)
        return this.shadowRoot
    }

    /**
     * Get outerHTML including shadow DOM and slot content
     */
    get outerHTML() {
        // Build attributes string from this.attributes (already set by setProps)
        // Filter out internal/hidden attributes like 'symbol'
        const attrs = Object.entries(this.attributes || {})
            .filter(([name]) => name !== 'symbol') // Hide internal symbol attribute
            .map(([name, value]) => `${name.toLowerCase()}="${value ?? ''}"`)
            .join(' ')
        const attrStr = attrs ? ` ${attrs}` : ''

        // Build children string by resolving and converting each child to HTML
        const children = this.childNodes.map((child: any) => {
            // Resolve function children (JSX.Element wrappers)
            if (typeof child === 'function') {
                try {
                    let resolved = child()
                    // Keep resolving if result is also a function
                    while (typeof resolved === 'function') {
                        resolved = resolved()
                    }

                    // For SSR, use renderToString to convert JSX/Elements to HTML
                    if (resolved !== null && resolved !== undefined) {
                        return renderToString(resolved)
                    }

                    return String(resolved ?? '')
                } catch (e) {
                    console.error('[SSRCustomElement.outerHTML] Failed to resolve child:', e)
                    return String(child ?? '')
                }
            }
            if (typeof child === 'object' && child !== null) {
                // For Element objects, use renderToString
                return renderToString(child)
            }
            return String(child ?? '')
        }).join('')

        // If we have a shadow root, include shadow DOM content
        if (this.shadowRoot && this.shadowRoot.childNodes.length > 0) {
            const shadowContent = this.shadowRoot.childNodes.map((node: any) => {
                if (node.nodeType === 1 && node.tagName === 'SLOT') {
                    // Render slot element with assigned content
                    return node.outerHTML
                }
                return renderToString(node)
            }).join('')

            return `<${this.tagName.toLowerCase()}${attrStr}>${shadowContent}${children}</${this.tagName.toLowerCase()}>`
        }

        return `<${this.tagName.toLowerCase()}${attrStr}>${children}</${this.tagName.toLowerCase()}>`
    }
}

/**
 * SSR Shadow Root implementation
 * Represents the shadow DOM container for custom elements
 */
export class SSRShadowRoot extends Element {
    host: SSRCustomElement

    constructor(host: SSRCustomElement) {
        super('#shadow-root')
        this.host = host
    }

    get outerHTML() {
        // Shadow root content is rendered inline within the custom element
        return this.childNodes.map((child: any) => {
            return renderToString(child)
        }).join('')
    }
}

/**
 * SSR Slot element implementation
 * Represents a <slot> element within a shadow DOM
 */
export class SSRSlotElement extends Element {
    assignedNodes: any[] = []

    constructor() {
        super('slot')
    }

    /**
     * Get nodes assigned to this slot
     */
    assignedNodes() {
        return this.assignedNodes
    }

    get outerHTML() {
        const attrs = Object.entries(this.attributes || {})
            .map(([name, value]) => `${name.toLowerCase()}="${value ?? ''}"`)
            .join(' ')
        const attrStr = attrs ? ` ${attrs}` : ''

        // Include assigned nodes as slot content
        const slotContent = this.assignedNodes.map((node: any) => {
            return renderToString(node)
        }).join('')

        return `<slot${attrStr}>${slotContent}</slot>`
    }
}