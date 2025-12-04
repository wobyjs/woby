/**
 * Mock customElements object for SSR
 */

import type { Component } from "../types"

// Simple dictionary to store custom element definitions in SSR environment
const customElementsRegistry: Map<string, any> = new Map()

export const customElements = {
    define: (tagName: string, component: any) => {
        customElementsRegistry.set(tagName, component)
    },

    get: (tagName: string) => {
        return customElementsRegistry.get(tagName)
    },

    whenDefined: async (tagName: string) => {
        // In SSR, we just return a resolved promise since all components are already defined
        return Promise.resolve()
    }
}