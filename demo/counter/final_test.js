// Final test to verify the jsx() function fix
import { renderToString, jsx } from 'woby/ssr'

// Test with JSX equivalent using jsx() calls
const JSXTest = () => {
    return jsx('div', null,
        jsx('h1', null, 'JSX Child 1'),
        jsx('h2', null, 'JSX Child 2')
    )
}

// Test with direct jsx() calls (CORRECT way)
const DirectTest = () => {
    return jsx('div', null,
        jsx('h1', null, 'Direct Child 1'),
        jsx('h2', null, 'Direct Child 2')
    )
}

console.log('=== JSX vs Direct jsx() Comparison ===\n')

console.log('1. JSX Syntax Test:')
const jsxResult = renderToString(JSXTest())
console.log('   Result:', jsxResult)

console.log('\n2. Direct jsx() Calls Test:')
const directResult = renderToString(DirectTest())
console.log('   Result:', directResult)

console.log('\n=== Analysis ===')
console.log('JSX Result Has Children:', jsxResult.includes('<H1>') && jsxResult.includes('<H2>'))
console.log('Direct Result Has Children:', directResult.includes('<H1>') && directResult.includes('<H2>'))
console.log('Both results match:', jsxResult === directResult)