// Test to diagnose the double child issue in DirectTest
import { renderToString, createElement } from 'woby/ssr'

// Test with createElement syntax (equivalent to JSX)
const JSXTest = () => {
    return createElement('div', null,
        createElement('h1', null, 'JSX Child 1'),
        createElement('h2', null, 'JSX Child 2')
    )
}

// Test with direct createElement calls (the problematic one)
const DirectTest = () => {
    // This is the incorrect way that causes the double child issue
    // return createElement('div', {
    //     children: [
    //         createElement('h1', { children: 'Direct Child 1' }),
    //         createElement('h2', { children: 'Direct Child 2' })
    //     ]
    // })

    // This is the correct way
    return createElement('div', null,
        createElement('h1', null, 'Direct Child 1'),
        createElement('h2', null, 'Direct Child 2')
    )
}

console.log('=== JSX vs Direct createElement() Comparison ===\n')

console.log('1. JSX Syntax Test (using createElement):')
const jsxResult = renderToString(JSXTest())
console.log('   Result:', jsxResult)

console.log('\n2. Direct createElement() Calls Test:')
const directResult = renderToString(DirectTest())
console.log('   Result:', directResult)

console.log('\n=== Analysis ===')
console.log('JSX Result Has Children:', jsxResult.includes('<H1>') && jsxResult.includes('<H2>'))
console.log('Direct Result Has Children:', directResult.includes('<H1>') && directResult.includes('<H2>'))