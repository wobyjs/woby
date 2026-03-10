/**
 * Element implementation for SSR
 * This class represents the base Element class in the DOM hierarchy
 */

import { BaseNode } from './base_node'
import { Style } from './style'
import { Comment } from './comment'

export class Element extends BaseNode {
    tagName: string
    style: Style
    #className: string
    attributes: Record<string, string>

    constructor(tagName: string) {
        super(1) // ELEMENT_NODE
        this.tagName = tagName.toUpperCase()
        this.style = new Style()
        this.#className = ''
        this.attributes = {}
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

    // Getter for innerHTML
    get innerHTML(): string {
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

    // Setter for innerHTML
    set innerHTML(content: string) {
        // Clear existing children
        this.childNodes = []
        // Add as text node
        this.appendChild({
            nodeType: 3,
            textContent: String(content),
            toString: () => String(content)
        })
    }

    // Basic Element methods that should be available
    getAttribute(name: string): string | null {
        return this.attributes[name] ?? null
    }

    // Override setAttribute for special HTML handling
    setAttribute(name: string, value: any) {
        // Handle special cases for style and class
        if (name === 'style') {
            // Store the string value in attributes but keep style as object
            this.attributes['style'] = value
            // Don't overwrite this.style - keep it as Style object
        } else if (name === 'class' || name === 'className') {
            // Use the setter to ensure synchronization
            this.className = value
        } else if (name === 'htmlFor') {
            // Convert htmlFor to for for HTML compliance
            this.attributes['for'] = String(value)
        } else {
            this.attributes[name] = String(value)
        }
        super.setAttribute(name, value)
    }

    removeAttribute(name: string) {
        delete this.attributes[name]
        super.removeAttribute(name)
    }

    hasAttribute(name: string): boolean {
        return name in this.attributes
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
        // Build attributes string - normalize attribute names to lowercase for HTML compliance
        const attrs = Object.entries(this.attributes)
            .map(([name, value]) => `${name.toLowerCase()}="${value}"`)
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
                } else if (child.shadowRRoot){
                    return child.shadowRRoot.innerHTML
                } else if ('textContent' in child) {
                    return child.textContent
                }
            }
            return String(child)
        }).join('')

        return `<${this.tagName.toLowerCase()}${attrStr}>${children}</${this.tagName.toLowerCase()}>`
    }

    // // Add textContent property
    // get textContent(): string {
    //     return super.textContent
    // }

    // set textContent(text: string) {
    //     super.textContent = text
    // }

    // Add cloneNode method
    cloneNode(deep?: boolean): globalThis.Node {
        // Create new instance of the same class to preserve prototype chain
        const cloned = new Element(this.tagName)

        // Clone all attributes
        cloned.attributes = { ...this.attributes }

        // Clone className (also kept in sync via attributes)
        cloned.#className = this.#className

        // Clone style object properly (not just reference)
        if (this.style && typeof this.style === 'object') {
            // Style is a class instance, need to preserve it
            cloned.style = new Style()
            // Copy all style properties
            Object.assign(cloned.style, this.style)
        }

        // Clone other BaseNode properties
        cloned.nodeType = this.nodeType
        cloned.parentNode = null // Don't clone parent reference

        if (deep) {
            // Deep clone child nodes
            cloned.childNodes = this.childNodes.map(child => {
                if (child.cloneNode) {
                    // If child has cloneNode, use it
                    return child.cloneNode(true)
                }

                // For text nodes and other simple nodes
                if (child.nodeType === 3) { // TEXT_NODE
                    // Preserve text content and nodeValue
                    const textClone = new (child.constructor as any)(String((child as any).textContent || (child as any).nodeValue || ''))
                    // Copy all properties
                    Object.keys(child).forEach(key => {
                        if (!(key in textClone)) {
                            textClone[key] = (child as any)[key]
                        }
                    })
                    return textClone
                }

                if (child.nodeType === 8) { // COMMENT_NODE
                    const commentContent = (child as any).textContent || (child as any).data || ''
                    const commentClone = new Comment(String(commentContent))
                    return commentClone
                }

                // For other nodes, create a basic clone preserving constructor
                const SimpleClone = function () { }
                SimpleClone.prototype = Object.create(Object.getPrototypeOf(child))
                const simpleClone = new (SimpleClone as any)()

                // Copy all enumerable properties
                Object.keys(child).forEach(key => {
                    const value = (child as any)[key]
                    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                        // Deep clone nested objects
                        try {
                            simpleClone[key] = JSON.parse(JSON.stringify(value))
                        } catch {
                            // For non-serializable objects, shallow copy
                            simpleClone[key] = value
                        }
                    } else {
                        simpleClone[key] = value
                    }
                })

                return simpleClone
            }) as any as BaseNode[]

            // Set parent references for cloned children
            cloned.childNodes.forEach(child => {
                (child as any).parentNode = cloned
            })
        }

        return cloned as unknown as globalThis.Node
    }

    // Add replaceWith method
    replaceWith(...nodes: (globalThis.Node | string)[]): void {
        if (!this.parentNode) {
            // If no parent, we can't replace this node
            return
        }

        // Convert string nodes to text nodes
        const convertedNodes = nodes.map(node => {
            if (typeof node === 'string') {
                // Create a simple text node implementation
                const textNode = Object.create(null)
                textNode.nodeType = 3 // TEXT_NODE
                textNode.textContent = node
                textNode.data = node
                textNode.toString = () => node
                return textNode
            }
            return node
        })

        // Find our index in the parent
        const parent = this.parentNode as Element
        const index = parent.childNodes.indexOf(this as any)

        if (index !== -1) {
            // Remove ourselves
            parent.removeChild(this as any)

            // Insert new nodes at our position
            for (let i = 0; i < convertedNodes.length; i++) {
                const node = convertedNodes[i]
                if (i === 0) {
                    // For the first node, use the original position
                    parent.insertBefore(node as any, parent.childNodes[index] as any)
                } else {
                    // For subsequent nodes, insert after the previous one
                    parent.insertBefore(node as any, parent.childNodes[index + i] as any)
                }
            }
        }
    }
}
