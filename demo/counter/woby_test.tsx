// Import woby functionality
import { renderToString } from '../../src/ssr'
import { html } from '../../src/index'

// BREAKPOINT 1 - Execution starts here
console.log('Starting Woby test')

// Sample component using woby
const CounterComponent = () => {
    // BREAKPOINT 2 - Component definition
    let count = 0

    const increment = () => {
        count++
        console.log('Count incremented to:', count)
    }

    const decrement = () => {
        count--
        console.log('Count decremented to:', count)
    }

    // BREAKPOINT 3 - Render component
    return html`
    <div>
      <h1>Woby Counter Test</h1>
      <p>Count: ${count}</p>
      <button onClick=${increment}>+</button>
      <button onClick=${decrement}>-</button>
    </div>
  `
}

// BREAKPOINT 4 - Testing renderToString
try {
    console.log('Attempting to render component to string...')
    const renderedHtml = renderToString(CounterComponent())
    console.log('Rendered HTML:', renderedHtml)
} catch (error) {
    console.error('Error during renderToString:', error)
}

// BREAKPOINT 5 - Additional woby functionality test
console.log('Testing additional woby features...')

// Export for module system
export { CounterComponent }