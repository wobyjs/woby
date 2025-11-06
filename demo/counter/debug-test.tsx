import { $, renderToString } from 'woby/ssr'

// Simple test without custom elements
const SimpleApp = () => {
    return (
        <div class="test">
            <h1>Hello World</h1>
            <p>Value: <b>5</b></p>
        </div>
    )
}

const result = renderToString(<SimpleApp />)
console.log('Rendered HTML:')
console.log(JSON.stringify(result, null, 2))
console.log('--- End of rendered HTML ---')