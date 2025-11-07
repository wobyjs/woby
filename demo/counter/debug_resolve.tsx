import { renderToString, jsx } from 'woby/ssr'
import { resolve } from 'woby/ssr'

// Test with JSX syntax
const JSXTest = () => {
    return (
        <div>
            <h1>JSX Child 1</h1>
            <h2>JSX Child 2</h2>
        </div>
    )
}

console.log('=== Debug Resolve ===\n')

console.log('1. JSX Syntax Test:')
const jsxElement = <JSXTest />
console.log('JSX Element:', jsxElement)

// Try to resolve the JSX element
try {
    const resolved = resolve(jsxElement)
    console.log('Resolved JSX Element:', resolved)

    // Try to render the resolved element
    const result = renderToString(resolved)
    console.log('Render Result:', result)
} catch (error) {
    console.log('Error resolving JSX element:', error.message)
}

console.log('\n2. Direct Element Test:')
const directElement = jsx('div', {
    children: [
        jsx('h1', { children: 'Direct Child 1' }),
        jsx('h2', { children: 'Direct Child 2' })
    ]
})
console.log('Direct Element:', directElement)

try {
    const resolved = resolve(directElement)
    console.log('Resolved Direct Element:', resolved)

    // Try to render the resolved element
    const result = renderToString(resolved)
    console.log('Render Result:', result)
} catch (error) {
    console.log('Error resolving direct element:', error.message)
}