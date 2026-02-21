/// @jsxImportSource woby
/// @jsxRuntime automatic

import { renderToString, jsx } from 'woby'

// Simple test with JSX
const JSXTest = () => {
    return (
        <div>
            <h1>JSX Child</h1>
        </div>
    )
}

// Simple test with direct jsx() calls React 16 style
const DirectTest16 = () => {
    return jsx('div', {},
        jsx('h1', {}, 'Direct Child')
    )
}

// Simple test with direct jsx() calls React 17 style
const DirectTest17 = () => {
    return jsx('div', {
        children: jsx('h1', { children: 'Direct Child 17' })
    })
}

console.log('=== Simple JSX vs Direct jsx() Comparison ===\n')

console.log('1. JSX Syntax Test:')
const jsxResult = renderToString(<JSXTest />)
console.log('   Result:', jsxResult)

console.log('\n2. Direct jsx() Calls Test React 16:')
const directResult16 = renderToString(<DirectTest16 />)
console.log('   Result:', directResult16)

console.log('\n3. Direct jsx() Calls Test React 17:')
const directResult17 = renderToString(<DirectTest17 />)
console.log('   Result:', directResult17)

console.log('\n=== Analysis ===')
console.log('JSX Result Empty:', jsxResult === '<DIV></DIV>')
console.log('Direct 16 Result Empty:', directResult16 === '<DIV></DIV>')
console.log('Direct 17 Result Empty:', directResult17 === '<DIV></DIV>')