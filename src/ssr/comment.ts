/**
 * Comment Node Implementation for SSR
 * 
 * This class provides a mock implementation of the Comment node for server-side rendering
 * environments where browser APIs are not available.
 */

import { BaseNode } from './base_node'

export class Comment extends BaseNode /* implements globalThis.Comment */ {
    constructor(public data: string = '') {
        super(8) // Node type 8 is COMMENT_NODE
    }

    get textContent(): string {
        return this.data
    }
    /**
     * Returns the string representation of the comment
     * This is used when rendering the comment in SSR
     */
    toString(): string {
        return `<!--${this.data}-->`
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