/**
 * Element implementation for SSR
 * This class represents the base Element class in the DOM hierarchy
 */

import { BaseNode } from './base_node'

export class Element extends BaseNode {
    tagName: string
    attributes: Record<string, string>

    constructor(tagName: string) {
        super(1) // ELEMENT_NODE
        this.tagName = tagName.toUpperCase()
        this.attributes = {}
    }

    // Basic Element methods that should be available
    getAttribute(name: string): string | null {
        return this.attributes[name] ?? null
    }

    setAttribute(name: string, value: any) {
        this.attributes[name] = String(value)
        super.setAttribute(name, value)
    }

    removeAttribute(name: string) {
        delete this.attributes[name]
        super.removeAttribute(name)
    }

    hasAttribute(name: string): boolean {
        return name in this.attributes
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
        // This is a simplified implementation
        const cloned = new Element(this.tagName)
        cloned.attributes = { ...this.attributes }

        if (deep) {
            cloned.childNodes = this.childNodes.map(child => {
                if (child.cloneNode) {
                    return child.cloneNode(true)
                }
                // For simple nodes, create a basic clone
                const simpleClone = new BaseNode(child.nodeType)
                simpleClone.attributes = { ...child.attributes }
                return simpleClone
            }) as any as BaseNode[]
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