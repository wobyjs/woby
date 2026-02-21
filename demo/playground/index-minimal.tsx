/* IMPORT */

import * as Woby from 'woby'
import type { JSX } from 'woby'
import { $, render } from 'woby'

// Import just a few simple test components
import TestSimpleExpect from './src/TestSimpleExpect'
import TestNullStatic from './src/TestNullStatic'
import TestBooleanStatic from './src/TestBooleanStatic'
import TestStringStatic from './src/TestStringStatic'

globalThis.Woby = Woby

/* MAIN */

const tests = [
    TestSimpleExpect,
    TestNullStatic,
    TestBooleanStatic,
    TestStringStatic
]

const App = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {tests.map((TestComponent, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "10px" }}>
                <TestComponent />
            </div>
        ))}
    </div>
)

export default App

// Render the app
let appRendered = false
let renderTimeout = null

const renderApp = () => {
    // Clear any existing timeout
    if (renderTimeout !== null) {
        clearTimeout(renderTimeout)
        renderTimeout = null
    }

    if (appRendered) {
        console.log('App already rendered, skipping')
        return
    }

    const appElement = document.getElementById('app')
    console.log('Attempting to render app, app element:', appElement)

    if (appElement) {
        try {
            console.log('Calling render with element:', appElement)
            render(<App />, appElement)
            appRendered = true
            console.log('App rendered successfully')
        } catch (error) {
            console.error('Failed to render app:', error)
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                element: appElement,
                elementType: typeof appElement,
                elementConstructor: appElement?.constructor?.name
            })
        }
    } else {
        console.error('App element not found')
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp)
} else {
    // Small delay to ensure DOM is fully ready
    setTimeout(renderApp, 0)
}