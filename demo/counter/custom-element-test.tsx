import { $, customElement, renderToString, defaults } from 'woby/ssr'

// Simple counter component
const Counter = defaults(() => ({
    value: $(0)
}), (props) => {
    const { value, children, ...restProps } = props
    return (
        <div {...restProps}>
            <p>Value: <b>{value}</b></p>
            {children}
        </div>
    )
})

// Register the Counter component as a custom element
customElement('counter-element', Counter)

// Application Component
const App = () => {
    return (
        <>
            <h1>Custom Element Test</h1>
            <counter-element value={5} class="test-counter">
                <span>Child content</span>
            </counter-element>
        </>
    )
}

const result = renderToString(<App />)
console.log('Rendered HTML:')
console.log(result)
console.log('--- End of rendered HTML ---')