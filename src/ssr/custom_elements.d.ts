/**
 * Mock customElements object for SSR
 */
import type { Component } from "../types";
import { Element } from './element';
export declare const customElements: {
    define: (tagName: string, component: any) => void;
    get: (tagName: string) => any;
    whenDefined: (tagName: string) => Promise<void>;
};
/**
 * SSRCustomElement class for server-side rendering
 * Extends Element to provide custom element functionality with shadow DOM and slot support
 */
export declare class SSRCustomElement extends Element {
    static __component__: Component<any>;
    props: any;
    childNodes: any[];
    shadowRoot: SSRShadowRoot | null;
    slots: any[];
    constructor(tagName: string, props?: any);
    /**
     * Attach a shadow root to the custom element
     */
    attachShadow(options: {
        mode: string;
        serializable?: boolean;
    }): SSRShadowRoot;
    /**
     * Get outerHTML including shadow DOM and slot content
     */
    get outerHTML(): string;
}
/**
 * SSR Shadow Root implementation
 * Represents the shadow DOM container for custom elements
 */
export declare class SSRShadowRoot extends Element {
    host: SSRCustomElement;
    constructor(host: SSRCustomElement);
    get outerHTML(): string;
}
/**
 * SSR Slot element implementation
 * Represents a <slot> element within a shadow DOM
 */
export declare class SSRSlotElement extends Element {
    assignedNodes: any[];
    constructor();
    get outerHTML(): string;
}
//# sourceMappingURL=custom_elements.d.ts.map