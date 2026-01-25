/**
 * Text Node Implementation for SSR
 * 
 * This class provides a mock implementation of the Text node for server-side rendering
 * environments where browser APIs are not available.
 */

import { BaseNode } from './base_node'

export class Text extends BaseNode {
    constructor(public data: string = '') {
        super(3) // Node type 3 is TEXT_NODE
    }

    get textContent(): string {
        return this.data
    }
    /**
     * Returns the string representation of the text node
     * This is used when rendering the text content in SSR
     */
    toString(): string {
        return this.data
    }

    /**
     * Gets the text content of the comment
     */
    get nodeValue(): string {
        return this.data
    }

    /**
     * Sets the text content of the comment
     */
    set nodeValue(value: string) {
        this.data = value
    }
}