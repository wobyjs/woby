/**
 * Comment Node Implementation for SSR
 *
 * This class provides a mock implementation of the Comment node for server-side rendering
 * environments where browser APIs are not available.
 */
import { BaseNode } from './base_node';
export declare class Comment extends BaseNode {
    data: string;
    constructor(data?: string);
    get textContent(): string;
    /**
     * Returns the string representation of the comment
     * This is used when rendering the comment in SSR
     */
    toString(): string;
    /**
     * Gets the text content of the comment
     */
    get nodeValue(): string;
    /**
     * Sets the text content of the comment
     */
    set nodeValue(value: string);
}
//# sourceMappingURL=comment.d.ts.map