import type { ComponentIntrinsicElement, FN } from '../types'
import { BaseNode } from '../methods/ssr.obj'

// Enhanced mock implementations for SSR without happy-dom
// These implementations better support the html`` template pattern from index.tsx

const createCommentSSR = ((content: string) => ({
    nodeType: 8,
    textContent: content,
    toString: () => `<!--${content}-->`
})) as any as FN<[string], Comment>

const createHTMLNodeSSR = ((tagName: string) => {
    class HTMLNode extends BaseNode {
        tagName: string
        style: any
        className: string

        constructor() {
            super(1)
            this.tagName = tagName.toUpperCase()
            this.style = {}
            this.className = ''
        }

        // Override setAttribute for special HTML handling
        setAttribute(name: string, value: any) {
            // Handle special cases for style and class
            if (name === 'style') {
                this.style = value
            } else if (name === 'class' || name === 'className') {
                this.className = value
            }
            super.setAttribute(name, value)
        }

        // Method to set innerHTML (simplified)
        set innerHTML(content: string) {
            // Clear existing children
            this.childNodes = []
            // Add as text node
            this.appendChild(createTextSSR(content))
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
    }

    return new HTMLNode()
}) as any as FN<[string], HTMLElement>

const createSVGNodeSSR = ((tagName: string) => {
    class SVGNode extends BaseNode {
        tagName: string
        isSVG: boolean
        style: any

        constructor() {
            super(1)
            this.tagName = tagName.toUpperCase()
            this.isSVG = true
            this.style = {}
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

            return `<${this.tagName}${attrStr}>${children}</${this.tagName}>`
        }
    }

    return new SVGNode()
}) as any as FN<[string], SVGElement>

const createTextSSR = ((text: string) => ({
    nodeType: 3,
    textContent: String(text),
    toString: () => String(text)
})) as any as FN<[string], Text>

const createDocumentFragmentSSR = (() => {
    class DocumentFragmentNode extends BaseNode {
        constructor() {
            super(11)
        }
    }

    return new DocumentFragmentNode()
}) as any as FN<[], DocumentFragment>

declare const via

/* MAIN */

// Simple approach: always use SSR versions in Node.js environment
const isNodeEnvironment = typeof window === 'undefined' && typeof document === 'undefined'

function getCreators() {
    if (isNodeEnvironment) {
        return {
            createComment: createCommentSSR,
            createHTMLNode: createHTMLNodeSSR,
            createSVGNode: createSVGNodeSSR,
            createText: createTextSSR,
            createDocumentFragment: createDocumentFragmentSSR
        }
    } else {
        // Browser environment
        if (typeof via !== 'undefined') {
            const document = via.document
            return {
                createComment: document.createComment as any as FN<[any], Comment>,
                createHTMLNode: document.createElement as any as FN<[ComponentIntrinsicElement], HTMLElement>,
                createSVGNode: ((name: string) => document.createElementNS('http://www.w3.org/2000/svg', name)) as any as FN<[ComponentIntrinsicElement], SVGElement>,
                createText: document.createTextNode as any as FN<[any], Text>,
                createDocumentFragment: document.createDocumentFragment as any as FN<[], DocumentFragment>
            }
        } else {
            // Standard browser environment
            try {
                // Check if document exists before trying to bind
                if (typeof document !== 'undefined' && document !== null) {
                    return {
                        createComment: document.createComment.bind(document, '') as FN<[any], Comment>,
                        createHTMLNode: document.createElement.bind(document) as FN<[ComponentIntrinsicElement], HTMLElement>,
                        createSVGNode: document.createElementNS.bind(document, 'http://www.w3.org/2000/svg') as FN<[ComponentIntrinsicElement], Element>,
                        createText: document.createTextNode.bind(document) as FN<[any], Text>,
                        createDocumentFragment: document.createDocumentFragment.bind(document) as FN<[], DocumentFragment>
                    }
                }
            } catch (e) {
                // Ignore error and fall through to SSR versions
            }

            // Fallback to SSR versions if document is not available or binding fails
            return {
                createComment: createCommentSSR,
                createHTMLNode: createHTMLNodeSSR,
                createSVGNode: createSVGNodeSSR,
                createText: createTextSSR,
                createDocumentFragment: createDocumentFragmentSSR
            }
        }
    }
}

const { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment } = getCreators()

/* EXPORT */

export { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment }
// Export SSR versions for direct imports
export { createCommentSSR, createHTMLNodeSSR, createSVGNodeSSR, createTextSSR, createDocumentFragmentSSR }