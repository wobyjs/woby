// Test with multiple children
import { renderToString } from 'woby/ssr'

// Simple test component using JSX with multiple children
const App = () => {
    return (
        <div>
            <h1>Test 1</h1>
            <h2>Test 2</h2>
        </div>
    )
}

// Test the renderToString function
const result = renderToString(<App />)
console.log('Rendered HTML:')
console.log(result)
console.log('--- End of rendered HTML ---')