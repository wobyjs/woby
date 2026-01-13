/**
 * HTMLElement implementation for SSR
 */

import { BaseNode } from './base_node'
import { Element } from './element'
import type { VoidHTMLAttributes } from '../types'

export type THTMLElement = HTMLElement & globalThis.HTMLElement

export class HTMLElement extends Element implements VoidHTMLAttributes<globalThis.HTMLElement>, globalThis.HTMLElement {
    tagName: string
    style: any
    className: string
    id: string
    // attributes: Record<string, string>

    constructor(tagName: string) {
        super(tagName)
        this.style = {}
        this.className = ''
        this.id = ''
    }

    // Override setAttribute for special HTML handling
    setAttribute(name: string, value: any) {
        // Handle special cases for style, class, and id
        if (name === 'style') {
            this.style = value
        } else if (name === 'class' || name === 'className') {
            this.className = value
        } else if (name === 'id') {
            this.id = value
        }
        super.setAttribute(name, value)
    }

    getAttribute(name: string): string | null {
        return this.attributes[name] ?? null
    }

    hasAttribute(name: string): boolean {
        return name in this.attributes
    }

    removeAttribute(name: string) {
        super.removeAttribute(name)
        if (name === 'class' || name === 'className') {
            this.className = ''
        } else if (name === 'id') {
            this.id = ''
        }
    }

    // Method to set innerHTML (simplified)
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

    // Add after method
    after(...nodes: any[]) {
        if (this.parentNode) {
            let nextSibling = this.nextSibling
            if (nextSibling) {
                nodes.forEach(node => {
                    this.parentNode.insertBefore(node, nextSibling)
                })
            } else {
                nodes.forEach(node => {
                    this.parentNode.appendChild(node)
                })
            }
        }
    }

    // Add replaceWith method
    replaceWith(...nodes: any[]) {
        if (this.parentNode) {
            nodes.forEach((node, index) => {
                if (index === 0) {
                    this.parentNode.replaceChild(node, this)
                } else {
                    this.parentNode.insertBefore(node, nodes[index - 1].nextSibling)
                }
            })
        }
    }

    // Add remove method
    remove() {
        if (this.parentNode) {
            this.parentNode.removeChild(this)
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
        if (['BR', 'HR', 'IMG', 'INPUT', 'META', 'LINK'].includes(this.tagName)) {
            return `<${this.tagName}${attrStr}>`
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

        return `<${this.tagName}${attrStr}>${children}</${this.tagName}>`
    }

    // Getter for innerText
    get innerText(): string {
        return this.textContent
    }

    // Setter for innerText
    set innerText(text: string) {
        this.textContent = text
    }

    // Getter for textContent (inherited from Element)
    get textContent(): string {
        return this.childNodes.map((child: any) => {
            if (child && typeof child === 'object') {
                return child.textContent || ''
            }
            return String(child || '')
        }).join('')
    }

    // Setter for textContent (inherited from Element)
    set textContent(text: string) {
        // Clear existing child nodes
        this.childNodes = []
        // Add a text node with the content
        this.appendChild({
            nodeType: 3,
            textContent: text,
            toString: () => text
        })
    }

    // Query selector methods
    querySelector(selector: string): HTMLElement | null {
        // Simplified implementation
        if (selector.startsWith('#')) {
            const id = selector.substring(1)
            return this._findElementById(id)
        } else if (selector.startsWith('.')) {
            const className = selector.substring(1)
            return this._findElementByClass(className)
        } else {
            // Tag selector
            return this._findElementByTag(selector.toUpperCase())
        }
    }

    // @ts-ignore
    querySelectorAll(selector: string): THTMLElement[] {
        // Simplified implementation
        const results: THTMLElement[] = []
        if (selector.startsWith('#')) {
            const id = selector.substring(1)
            const element = this._findElementById(id)
            if (element) results.push(element)
        } else if (selector.startsWith('.')) {
            const className = selector.substring(1)
            this._findAllElementsByClass(className, results)
        } else {
            // Tag selector
            this._findAllElementsByTag(selector.toUpperCase(), results)
        }
        return results
    }

    // Helper methods for query selectors
    private _findElementById(id: string): THTMLElement | null {
        for (const child of (this.childNodes as any as THTMLElement[])) {
            if (child.nodeType === 1 && child.id === id) {
                return child
            }
            if (child.nodeType === 1 && child.childNodes) {
                const found = child._findElementById(id)
                if (found) return found
            }
        }
        return null
    }

    private _findElementByClass(className: string): HTMLElement | null {
        for (const child of (this.childNodes as any as HTMLElement[])) {
            if (child.nodeType === 1 && child.className.split(' ').includes(className)) {
                return child
            }
            if (child.nodeType === 1 && child.childNodes) {
                const found = child._findElementByClass(className)
                if (found) return found
            }
        }
        return null
    }

    private _findElementByTag(tagName: string): HTMLElement | null {
        for (const child of (this.childNodes as any as HTMLElement[])) {
            if (child.nodeType === 1 && child.tagName === tagName) {
                return child
            }
            if (child.nodeType === 1 && child.childNodes) {
                const found = child._findElementByTag(tagName)
                if (found) return found
            }
        }
        return null
    }

    private _findAllElementsByClass(className: string, results: THTMLElement[]): void {
        for (const child of (this.childNodes as THTMLElement[])) {
            if (child.nodeType === 1) {
                if (child.className.split(' ').includes(className)) {
                    results.push(child)
                }
                if (child.childNodes) {
                    child._findAllElementsByClass(className, results)
                }
            }
        }
    }

    private _findAllElementsByTag(tagName: string, results: THTMLElement[]): void {
        for (const child of (this.childNodes as any as THTMLElement[])) {
            if (child.nodeType === 1) {
                if (child.tagName === tagName) {
                    results.push(child)
                }
                if (child.childNodes) {
                    child._findAllElementsByTag(tagName, results)
                }
            }
        }
    }

    // Properties
    get nextSibling(): any | null {
        if (!this.parentNode) return null
        const index = this.parentNode.childNodes.indexOf(this as any)
        return index !== -1 && index < this.parentNode.childNodes.length - 1
            ? this.parentNode.childNodes[index + 1]
            : null
    }

    get previousSibling(): any | null {
        if (!this.parentNode) return null
        const index = this.parentNode.childNodes.indexOf(this as any)
        return index > 0 ? this.parentNode.childNodes[index - 1] : null
    }

    get firstChild(): any | null {
        return this.childNodes.length > 0 ? this.childNodes[0] : null
    }

    get lastChild(): any | null {
        return this.childNodes.length > 0 ? this.childNodes[this.childNodes.length - 1] : null
    }

    // @ts-ignore
    get children(): any[] {
        return this.childNodes.filter(child => child.nodeType === 1)
    }

    get childElementCount(): number {
        return this.children.length
    }

    // Methods
    hasChildNodes(): boolean {
        return this.childNodes.length > 0
    }

    // @ts-ignore
    cloneNode(deep: boolean = false): HTMLElement {
        const cloned = new HTMLElement(this.tagName)
        cloned.attributes = { ...this.attributes }
        cloned.style = { ...this.style }
        cloned.className = this.className
        cloned.id = this.id

        if (deep) {
            cloned.childNodes = this.childNodes.map(child => {
                if (child.cloneNode) {
                    return child.cloneNode(true)
                }
                return { ...child }
            }) as any as BaseNode[]
            cloned.childNodes.forEach(child => {
                (child as any).parentNode = cloned
            })
        }

        return cloned
    }

    dispatchEvent(event: Event): boolean {
        // Mock implementation
        return true
    }
}