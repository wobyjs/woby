// Diagnosis of the double child issue in DirectTest
import { renderToString, jsx } from 'woby/ssr'

// Test with direct jsx() calls (CORRECT way)
const DirectTestFixed = () => {
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

console.log('=== Demonstrating the Double Child Issue ===\n')

console.log('1. Direct jsx() Calls Test (Fixed):')
try {
    const directResult = renderToString(DirectTestFixed())
    console.log('   Result:', directResult)
} catch (e) {
    console.log('   Error:', e.message)
}

console.log('\n2. Direct jsx() Calls Test (Broken - Double Child Issue):')
try {
    const brokenResult = renderToString(DirectTestBroken())
    console.log('   Result:', brokenResult)
} catch (e) {
    console.log('   Error:', e.message)
}

console.log('\n=== Analysis ===')
console.log('The issue occurs when:')
console.log('1. Children are passed as a "children" property in the props object')
console.log('2. Those children also have their own "children" property')
console.log('This creates a double nesting effect where children are rendered twice')