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
}