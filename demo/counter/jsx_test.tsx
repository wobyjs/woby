// Test using JSX syntax
import { renderToString } from 'woby/ssr'

// Simple test component using JSX
const App = () => {
    return (
        <div>
            <h1>Simple Test</h1>
            <div class="test">
                <h2>Hello World</h2>
                <p>This is a simple test.</p>
            </div>
        </div>
    )
}

// Test the renderToString function
const result = renderToString(<App />)
console.log('Rendered HTML:')
console.log(result)
console.log('--- End of rendered HTML ---')