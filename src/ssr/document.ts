/**
 * Mock document object for SSR
 */

import { BaseNode } from "./base_node"
import { Comment } from "./comment"
import type { FN } from "../types"

type EventListener = (evt: Event) => void
type EventListenerObject = {
    handleEvent(object: Event): void
}
type EventListenerOrEventListenerObject = EventListener | EventListenerObject
type AddEventListenerOptions = boolean | {
    capture?: boolean
    once?: boolean
    passive?: boolean
}

type EventListenerOptions = {
    capture?: boolean
}

// Enhanced mock implementations for SSR without happy-dom
// These implementations better support the html`` template pattern from index.tsx

const createComment = ((content: string) => {
    // Create a proper Comment instance that extends BaseNode
    const comment = new Comment(content)
    return comment
}) as any as FN<[string], Comment>

const createHTMLNode = ((tagName: string) => {
    class HTMLNode extends BaseNode {
        tagName: string
        style: any
        #className: string

        constructor() {
            super(1)
            this.tagName = tagName.toUpperCase()
            this.style = {}
            this.#className = ''
            this.id = ''
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
            return this.attributes['id'] || ''
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

const createSVGNode = ((tagName: string) => {
    class SVGNode extends BaseNode {
        tagName: string
        isSVG: boolean
        style: any
        #className: string

        constructor() {
            super(1)
            this.tagName = tagName.toUpperCase()
            this.isSVG = true
            this.style = {}
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

        // Getter for outerHTML
        get outerHTML() {
            // Build attributes string
            const attrs = Object.entries(this.attributes)
                .map(([name, value]) => `${name}="${value}"`)
                .join(' ')
            const attrStr = attrs ? ` ${attrs}` : ''

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

    return new SVGNode()
}) as any as FN<[string], SVGElement>

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

const createDocumentFragment = (() => {
    class DocumentFragmentNode extends BaseNode {
        constructor() {
            super(11)
        }
    }

    return new DocumentFragmentNode()
}) as any as FN<[], DocumentFragment>

/**
 * Type definition for SSR Document interface
 */
export interface SSRDocument {
    _eventListeners: Map<string, Array<{
        listener: EventListenerOrEventListenerObject
        options?: boolean | AddEventListenerOptions
    }>>
    body: HTMLElement
    createComment: typeof createComment
    createElement: typeof createHTMLNode
    createElementNS: FN<[string, string], Element>
    createTextNode: typeof createText
    createDocumentFragment: typeof createDocumentFragment
    addEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void
    removeEventListener: (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void
    _getEventListeners: (type: string) => Array<{
        listener: EventListenerOrEventListenerObject
        options?: boolean | AddEventListenerOptions
    }>
}

/**
 * Factory function to create isolated SSR document instances
 * Use this when you need separate document contexts (e.g., parallel tests, multiple renders)
 */
export const createDocument = (): SSRDocument => {
    console.log('[createDocument] Creating new isolated document instance')
    // Mock body element for SSR - fresh instance per document
    const body = createHTMLNode('body')
    console.log('[createDocument] Created body element:', body.tagName)

    return {
        // Map to store event listeners - isolated per document instance
        _eventListeners: new Map<string, Array<{
            listener: EventListenerOrEventListenerObject
            options?: boolean | AddEventListenerOptions
        }>>(),

        addEventListener: function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
            console.log('[document.addEventListener] Adding listener for type:', type)
            if (!this._eventListeners.has(type)) {
                this._eventListeners.set(type, [])
            }
            this._eventListeners.get(type)!.push({ listener, options })
        },

        removeEventListener: function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
            console.log('[document.removeEventListener] Removing listener for type:', type)
            if (this._eventListeners.has(type)) {
                const listeners = this._eventListeners.get(type)!
                const index = listeners.findIndex(item => item.listener === listener)
                if (index !== -1) {
                    listeners.splice(index, 1)
                }
            }
        },

        // Helper method to get listeners for testing/debugging
        _getEventListeners: function (type: string) {
            const listeners = this._eventListeners.get(type) || []
            console.log('[document._getEventListeners] Getting listeners for type:', type, 'count:', listeners.length)
            return listeners
        },

        createComment,
        createElement: ((tagName: string) => {
            console.log('[document.createElement] Creating element:', tagName)
            const element = createHTMLNode(tagName)
            console.log('[document.createElement] Created element with tag:', element.tagName, 'objectId:', (element as any).objectId)
            return element
        }) as typeof createHTMLNode,
        createElementNS: ((namespaceURI: string, qualifiedName: string) => {
            console.log('[document.createElementNS] Creating element with namespace:', namespaceURI, 'qualifiedName:', qualifiedName)
            if (namespaceURI === 'http://www.w3.org/2000/svg') {
                return createSVGNode(qualifiedName)
            }
            return createHTMLNode(qualifiedName)
        }) as any as FN<[string, string], Element>,
        createTextNode: createText,
        createDocumentFragment,

        // Body property for portal component - isolated per instance
        body
    }
}

/**
 * Default singleton document instance for simple use cases
 * Maintains backward compatibility with existing code
 */
export const document = createDocument()

