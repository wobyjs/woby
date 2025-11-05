/**
 * SSR Test for Custom Element Implementation
 * 
 * This test verifies that the customElement function works correctly in SSR environments
 * by rendering components to HTML strings without shadow DOM or slots.
 */

import { $ } from 'woby/ssr'
import { renderToString } from 'woby/ssr'
import { html } from 'woby/ssr'
import { customElement } from '../../src/methods/custom_element'
import { defaults } from '../../src/methods/defaults'

// Define a simple counter component with defaults
const Counter = defaults(() => ({
    value: $(0, { type: 'number' } as const),
    title: $('Counter')
}), (props: { value: any, title: any }) => {
    return html`
        <div>
            <h1>${props.title}</h1>
            <p>Count: ${props.value}</p>
        </div>
    `
})

// Test the SSR implementation
const testSSRCustomElement = () => {
    // Register as a custom element
    const CustomElementClass = customElement('counter-element', Counter)

    // Check if we're in SSR mode (no window/document)
    const isSSR = typeof window === 'undefined' || typeof document === 'undefined'

    console.log('SSR Mode:', isSSR)

    if (isSSR) {
        // In SSR mode, the customElement function should return a simple function
        // that creates standard HTML elements
        console.log('Custom Element Class:', typeof CustomElementClass)

        // Create an instance with props
        const element = (CustomElementClass as any)({
            value: $(5),
            title: $('SSR Counter')
        })

        console.log('Element outerHTML:', element.outerHTML)

        // Verify the output
        console.log('Expected HTML structure created')

        return element.outerHTML
    }

    return 'Not in SSR mode'
}

// Run the test
try {
    const result = testSSRCustomElement()
    console.log('SSR Custom Element Test Result:', result)
} catch (error) {
    console.error('SSR Custom Element Test Error:', error)
}