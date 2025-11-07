// Test to see how JSX transformation works
import { jsx, renderToString } from 'woby/ssr'

// This is what JSX gets transformed to
const test1 = () => {
    // This simulates JSX: <div><h1>Test</h1></div>
    return jsx('div', null, jsx('h1', null, 'Test'))
}

// This is what React 17 JSX gets transformed to
const test2 = () => {
    // This simulates JSX: <div><h1>Test</h1></div> in React 17 format
    return jsx('div', {
        children: jsx('h1', { children: 'Test' })
    })
}

console.log('Test 1 (React 16 format):', renderToString(test1()))
console.log('Test 2 (React 17 format):', renderToString(test2()))