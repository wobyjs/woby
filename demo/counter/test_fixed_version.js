// Test to verify the fix works
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

console.log('=== Testing Fixed vs Broken jsx() Usage ===\n')

console.log('1. Direct jsx() Calls Test (Fixed):')
try {
    const directResult = renderToString(DirectTestFixed())
    console.log('   Result:', directResult)
    console.log('   Has correct children count:', (directResult.match(/Direct Child/g) || []).length === 2)
} catch (e) {
    console.log('   Error:', e.message)
}

console.log('\n2. Direct jsx() Calls Test (Broken - Double Child Issue):')
try {
    const brokenResult = renderToString(DirectTestBroken())
    console.log('   Result:', brokenResult)
    console.log('   Has double children count:', (brokenResult.match(/Direct Child/g) || []).length > 2)
} catch (e) {
    console.log('   Error:', e.message)
}

console.log('\n=== Explanation ===')
console.log('The issue occurs when children are passed as a "children" property')
console.log('in the props object instead of as separate arguments.')
console.log('This causes elements to be rendered twice.')