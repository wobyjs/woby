/**
 * Mock document object for SSR
 */

import { BaseNode } from "./base_node"
import { Comment } from "./comment"
import { createHTMLNode } from "./html_node"
import type { FN } from "../types"
import { Style } from "./style"

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


export const createComment = ((content: string) => {
    return new Comment(content)
}) as any as FN<[string], Comment>


export const createSVGNode = ((tagName: string) => {
    class SVGNode extends BaseNode {
        tagName: string
        isSVG: boolean
        style: any
        #className: string

        constructor() {
            super(1)
            this.tagName = tagName.toUpperCase()
            this.isSVG = true
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

export const createText = ((text: string) => {
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
    }

    return new TextNode(text) as any
}) as any as FN<[string], Text>


// export const createText = ((text: string) => {
//     const node = {
//         nodeType: 3,
//         textContent: String(text),
//         parentNode: null as any,
//         toString: () => String(text)
//     }
//     return node
// }) as any as FN<[string], Text>


export const createDocumentFragment = (() => {
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
    // Mock body element for SSR - fresh instance per document
    const body = createHTMLNode('body')

    return {
        // Map to store event listeners - isolated per document instance
        _eventListeners: new Map<string, Array<{
            listener: EventListenerOrEventListenerObject
            options?: boolean | AddEventListenerOptions
        }>>(),

        addEventListener: function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
            if (!this._eventListeners.has(type)) {
                this._eventListeners.set(type, [])
            }
            this._eventListeners.get(type)!.push({ listener, options })
        },

        removeEventListener: function (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
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
            return this._eventListeners.get(type) || []
        },

        createComment,
        createElement: ((tagName: string) => {
            return createHTMLNode(tagName)
        }) as typeof createHTMLNode,
        createElementNS: ((namespaceURI: string, qualifiedName: string) => {
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

