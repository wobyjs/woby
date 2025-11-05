/* IMPORT */

import { $, $$, useMemo, Component } from 'woby/ssr'
import { renderToString } from 'woby/ssr'
import { customElement } from '../../src/methods/custom_element'
import { defaults } from '../../src/methods/defaults'

// Define a simple counter component with defaults
const Counter = defaults(() => ({
    value: $(0, { type: 'number' } as const),
    title: $('Counter')
}), ({ value, title }: { value: any, title: any }) => {
    return <div>
        <h1>{title}</h1>
        <p>Count: {value}</p>
    </div>
})

// Register as a custom element
customElement('counter-element', Counter)

/* MAIN */

const App: Component = () => {
    return <div>
        <h1>SSR Custom Element Test</h1>
        {/* In SSR mode, we can't use custom elements directly in JSX */}
        {/* We'll test the component directly instead */}
        <Counter value={5} title="SSR Counter" />
    </div>
}

// Render the app to a string for SSR
const htmlString = renderToString(<App />)

// Export the rendered string for server-side usage
export default () => htmlString