import type { FN } from '../types'

// Enhanced mock implementations for SSR without happy-dom
// These implementations better support the html`` template pattern from index.tsx

export const createComment = ((content: string) => ({
    nodeType: 8,
    textContent: content,
    toString: () => `<!--${content}-->`
})) as any as FN<[string], Comment>

export const createHTMLNode = ((tagName: string) => {
    const element: any = {
        nodeType: 1,
        tagName: tagName.toUpperCase(),
        attributes: {},
        childNodes: [],
        style: {},

        // Method to set attributes
        setAttribute: function (name: string, value: any) {
            // Handle special cases for style and class
            if (name === 'style') {
                this.style = value
            } else if (name === 'class' || name === 'className') {
                this.className = value
            }
            this.attributes[name] = String(value)
        },

        // Method to append child nodes
        appendChild: function (child: any) {
            this.childNodes.push(child)
        },

        // Method to set innerHTML (simplified)
        set innerHTML(content: string) {
            // Clear existing children
            this.childNodes = []
            // Add as text node
            this.childNodes.push(createText(content))
        },

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

    return element
}) as any as FN<[string], HTMLElement>

export const createSVGNode = ((tagName: string) => {
    const element: any = {
        nodeType: 1,
        tagName: tagName.toUpperCase(),
        isSVG: true,
        attributes: {},
        childNodes: [],
        style: {},

        // Method to set attributes
        setAttribute: function (name: string, value: any) {
            this.attributes[name] = String(value)
        },

        // Method to append child nodes
        appendChild: function (child: any) {
            this.childNodes.push(child)
        },

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

    return element
}) as any as FN<[string], SVGElement>

export const createText = ((text: string) => ({
    nodeType: 3,
    textContent: String(text),
    toString: () => String(text)
})) as any as FN<[string], Text>

export const createDocumentFragment = (() => ({
    nodeType: 11,
    childNodes: [],
    appendChild: function (node: any) {
        this.childNodes.push(node)
    }
})) as any as FN<[], DocumentFragment>