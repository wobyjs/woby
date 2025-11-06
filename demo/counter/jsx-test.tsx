import { renderToString } from 'woby/ssr'

// Test with explicit children in props
const result1 = renderToString(<div class="test" children={<h1>Hello World</h1>} />)
console.log('Result 1:')
console.log(result1)

// Test with multiple children in props
const result2 = renderToString(<div class="test" children={[<h1>Hello World</h1>, <p>This is a test.</p>]} />)
console.log('Result 2:')
console.log(result2)

console.log('--- End of tests ---')