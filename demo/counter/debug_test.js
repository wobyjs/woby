// Debug test to understand the double child issue
import { renderToString, jsx } from 'woby/ssr'

// Test with direct jsx() calls (CORRECT way - React 16)
const DirectTest16 = () => {
    return jsx('div', null,
        jsx('h1', null, 'Direct Child 1'),
        jsx('h2', null, 'Direct Child 2')
    )
}

// Test with direct jsx() calls (INCORRECT way - causes double child issue)
const DirectTestBroken = () => {
    return jsx('div', {
        children: [
            jsx('h1', { children: 'Direct Child 1' }),
            jsx('h2', { children: 'Direct Child 2' })
        ]
    })
}

console.log('=== Debug Test ===\n')

console.log('1. Direct jsx() Calls Test (React 16 - Correct):')
const directResult16 = renderToString(DirectTest16())
console.log('   Result:', directResult16)

console.log('\n2. Direct jsx() Calls Test (Broken - Double Child Issue):')
const directResultBroken = renderToString(DirectTestBroken())
console.log('   Result:', directResultBroken)