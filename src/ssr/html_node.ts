/**
 * HTMLNode class for SSR document mock
 */

import { BaseNode } from "./base_node"
import type { FN } from "../types"

/**
 * Style class for handling CSS properties in SSR
 */
class Style {
    [key: string]: any

    constructor() {
        // Add setProperty method for CSS custom properties
        this.setProperty = (name: string, value: string) => {
            this[name] = value
        }
    }

    setProperty(name: string, value: string): void {
        this[name] = value
    }
}

const createText = ((text: string) => {
    // Define TextNode that extends BaseNode for SSR compatibility
    const TextNode = class extends BaseNode {
        textContent: string
        objectId: string

        constructor(text: string) {
            super(3) // nodeType 3 for text
            this.objectId = Math.random().toString(36).substr(2, 9) // Unique ID for tracking
            this.textContent = String(text)
        }

        // Getter for text representation
        toString() {
            return this.textContent
        }

        // Property to get text as string for rendering
        get nodeValue() {
            return this.textContent
        }

        set nodeValue(value: string) {
            this.textContent = value
        }

        // DOM-like properties that may be needed by diff algorithm
        get nextSibling() {
            if (this.parentNode && Array.isArray(this.parentNode.childNodes)) {
                const index = this.parentNode.childNodes.indexOf(this)
                return index !== -1 ? this.parentNode.childNodes[index + 1] : null
            }
            return null
        }

        get previousSibling() {
            if (this.parentNode && Array.isArray(this.parentNode.childNodes)) {
                const index = this.parentNode.childNodes.indexOf(this)
                return index > 0 ? this.parentNode.childNodes[index - 1] : null
            }
            return null
        }
    }

    return new TextNode(text) as any
}) as any as FN<[string], Text>

export const createHTMLNode = ((tagName: string) => {
    class HTMLNode extends BaseNode {
        tagName: string
        style: any
        #className: string

        constructor() {
            super(1)
            this.tagName = tagName.toUpperCase()
            this.style = new Style()
            this.#className = ''
        }

        set className(value: string) {
            this.#className = value
            // Also update the attributes object to keep them in sync
            // Directly update the attributes to avoid circular calls
            this.attributes['class'] = value
        }

        get className(): string {
            return this.#className
        }

        set id(value: string) {
            // Update both the property and attributes for consistency
            this.setAttribute('id', value)
        }

        get id(): string {
            return this.attributes['id'] || null
        }

        // Override setAttribute for special HTML handling
        setAttribute(name: string, value: any) {
            // Handle special cases for style and class
            if (name === 'style') {
                this.style = value
            } else if (name === 'class' || name === 'className') {
                // Use the setter to ensure synchronization
                this.className = value
            }
            super.setAttribute(name, value)
        }

        // Method to set innerHTML (simplified)
        set innerHTML(content: string) {
            // Clear existing children
            this.childNodes = []
            // Add as text node
            this.appendChild(createText(content))
        }

        // Add append method for compatibility with diff algorithm
        append(...nodes: any[]) {
            nodes.forEach(node => {
                this.appendChild(node)
            })
        }

        // Add before method for compatibility with diff algorithm
        before(...nodes: any[]) {
            // This is a simplified implementation
            // In a real DOM, this would insert nodes before this node
            // But for our purposes, we'll just append to the parent
            if (this.parentNode) {
                nodes.forEach(node => {
                    this.parentNode.insertBefore(node, this)
                })
            }
        }

        // Getter for outerHTML
        get outerHTML() {
            // Build attributes string
            const attrs = Object.entries(this.attributes)
                .map(([name, value]) => `${name}="${value}"`)
                .join(' ')
            const attrStr = attrs ? ` ${attrs}` : ''

            // Handle self-closing tags
            if (['br', 'hr', 'img', 'input', 'meta', 'link'].includes(this.tagName.toLowerCase())) {
                return `<${this.tagName.toLowerCase()}${attrStr} />`
            }

            // Build children string
            const children = this.childNodes.map((child: any) => {
                if (typeof child === 'object' && child !== null) {
                    if ('outerHTML' in child) {
                        return child.outerHTML
                    } else if ('textContent' in child) {
                        return child.textContent
                    }
                }
                return String(child)
            }).join('')

            return `<${this.tagName.toLowerCase()}${attrStr}>${children}</${this.tagName.toLowerCase()}>`
        }

        // Getter for innerHTML
        get innerHTML() {
            return this.childNodes.map((child: any) => {
                if (typeof child === 'object' && child !== null) {
                    if ('outerHTML' in child) {
                        return child.outerHTML
                    } else if ('textContent' in child) {
                        return child.textContent
                    }
                }
                return String(child)
            }).join('')
        }
    }

    return new HTMLNode()
}) as any as FN<[string], HTMLElement>
