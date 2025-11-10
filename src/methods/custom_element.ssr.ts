/**
 * SSR Custom Element Implementation for Woby Framework
 * 
 * This module provides a mock implementation of custom elements for server-side rendering
 * environments where browser APIs like customElements, window, and document are not available.
 * 
 * @module customElement.ssr
 */

import { Observable } from "soby"
import type { Component, Child } from "../types"


/**
 * Creates a mock custom element for SSR environments
 *
 * This function creates a mock implementation of a custom element for use in
 * server-side rendering environments where browser APIs are not available.
 *
 * @template P - Component props type
 * @param tagName - The HTML tag name for the custom element
 * @param component - The component function that renders the element's content
 * @returns A mock custom element class
 */
export const createSSRCustomElement = <P extends { children?: Observable<Child> }>(
    tagName: string,
    component: Component<P>
) => {
    // Create a mock class for SSR that behaves like the browser version
    class SSRCustomElement {
        static __component__ = component
        public props: P
        public attributes: Record<string, string> = {}

        constructor(props?: P) {
            // In SSR, we just store the props
            this.props = props || {} as P
        }

        // Mock methods for SSR
        static get observedAttributes() {
            return []
        }

        // Mock HTMLElement methods needed for SSR
        setAttribute(name: string, value: string) {
            this.attributes[name] = value
        }

        getAttribute(name: string) {
            return this.attributes[name]
        }

        removeAttribute(name: string) {
            delete this.attributes[name]
        }

        connectedCallback() { }
        disconnectedCallback() { }
        attributeChangedCallback() { }
    }

    // Add static properties that the SSR code expects
    ; (SSRCustomElement as any).__component__ = component

    // Register the component in our dictionary
    customElements.define(tagName, SSRCustomElement as any)

    // Return the mock class for SSR
    return SSRCustomElement as unknown as typeof HTMLElement
}