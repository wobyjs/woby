import type { ComponentIntrinsicElement, FN } from '../types'

declare const via

// Browser-only implementations
const createCommentSSR = ((content: string) => ({
    nodeType: 8,
    textContent: content,
    toString: () => `<!--${content}-->`
})) as any as FN<[string], Comment>

const createHTMLNodeSSR = ((tagName: string) => {
    return {
        nodeType: 1,
        tagName: tagName.toUpperCase(),
        style: {},
        className: '',
        childNodes: [],
        attributes: {},
        parentNode: null,

        setAttribute(name: string, value: any) {
            if (name === 'style') {
                this.style = value
            } else if (name === 'class' || name === 'className') {
                this.className = value
            }
            this.attributes[name] = value
        },

        set innerHTML(content: string) {
            this.childNodes = [{
                nodeType: 3,
                textContent: content,
                toString: () => content
            }]
        },

        appendChild(node: any) {
            this.childNodes.push(node)
            node.parentNode = this
        },

        append(...nodes: any[]) {
            nodes.forEach(node => this.appendChild(node))
        },

        before(...nodes: any[]) {
            if (this.parentNode) {
                const index = this.parentNode.childNodes.indexOf(this)
                if (index !== -1) {
                    this.parentNode.childNodes.splice(index, 0, ...nodes)
                    nodes.forEach(node => node.parentNode = this.parentNode)
                }
            }
        },

        insertBefore(newNode: any, referenceNode: any) {
            const index = this.childNodes.indexOf(referenceNode)
            if (index !== -1) {
                this.childNodes.splice(index, 0, newNode)
                newNode.parentNode = this
            } else {
                this.appendChild(newNode)
            }
        },

        get outerHTML() {
            const attrs = Object.entries(this.attributes)
                .map(([name, value]) => `${name}="${value}"`)
                .join(' ')
            const attrStr = attrs ? ` ${attrs}` : ''

            if (['br', 'hr', 'img', 'input', 'meta', 'link'].includes(this.tagName.toLowerCase())) {
                return `<${this.tagName}${attrStr}>`
            }

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
}) as any as FN<[string], HTMLElement>

const createSVGNodeSSR = ((tagName: string) => {
    return {
        nodeType: 1,
        tagName: tagName.toUpperCase(),
        isSVG: true,
        style: {},
        childNodes: [],
        attributes: {},
        parentNode: null,

        get outerHTML() {
            const attrs = Object.entries(this.attributes)
                .map(([name, value]) => `${name}="${value}"`)
                .join(' ')
            const attrStr = attrs ? ` ${attrs}` : ''

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
}) as any as FN<[string], SVGElement>

const createTextSSR = ((text: string) => ({
    nodeType: 3,
    textContent: String(text),
    toString: () => String(text)
})) as any as FN<[string], Text>

const createDocumentFragmentSSR = (() => {
    return {
        nodeType: 11,
        childNodes: [],
        parentNode: null,

        appendChild(node: any) {
            this.childNodes.push(node)
            node.parentNode = this
        }
    }
}) as any as FN<[], DocumentFragment>

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