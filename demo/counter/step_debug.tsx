// Step by step debug
import { renderToString } from 'woby/ssr'

// Simple component with multiple static children
const TestComponent = () => {
    return (
        <div>
            <h1>Header 1</h1>
            <h2>Header 2</h2>
        </div>
    )
}

console.log('Rendering TestComponent...')
const result = renderToString(<TestComponent />)
console.log('Result:', result)