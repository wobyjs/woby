import { renderToString, jsx } from 'woby/ssr'
/// @jsxImportSource woby
/// @jsxRuntime automatic

import { renderToString } from 'woby'

// Simple test to see what JSX transpiles to
const SimpleTest = () => {
    return (
        <div>
            <h1>Test</h1>
        </div>
    )
}

console.log('Simple JSX Test:')
console.log(renderToString(<SimpleTest />))

// Test with JSX syntax
const JSXTest = () => {
    return (
        <div>
            <h1>JSX Child 1</h1>
            <h2>JSX Child 2</h2>
        </div>
    )
}

console.log('=== Debug JSXTest Function ===\n')

console.log('1. JSXTest function:')
console.log(JSXTest)

console.log('\n2. JSXTest() result:')
console.log(JSXTest())

console.log('\n3. JSXTest()() result:')
try {
    console.log(JSXTest()())
} catch (error: any) {
    console.log('Error:', error.message)
}

console.log('\n4. renderToString(JSXTest()):')
const result = renderToString(JSXTest())
console.log('Result:', result)