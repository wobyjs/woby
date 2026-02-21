/// @jsxImportSource woby
/// @jsxRuntime automatic

import { renderToString, jsx } from 'woby'

// Test the specific case that might be causing empty children
const DebugTest = () => {
    // This is how JSX transpiles to (React 17 style)
    return jsx('div', {
        children: [
            jsx('h1', { children: 'Child 1' }),
            jsx('h2', { children: 'Child 2' })
        ]
    })
}

// Test with a single child in props
const SingleChildTest = () => {
    return jsx('div', {
        children: jsx('h1', { children: 'Single Child' })
    })
}

console.log('=== Debug Tests ===\n')

console.log('1. Multiple Children in Props (React 17 style):')
const debugResult = renderToString(<DebugTest />)
console.log('   Result:', debugResult)
console.log('   Is Empty:', debugResult === '<DIV></DIV>')

console.log('\n2. Single Child in Props:')
const singleChildResult = renderToString(<SingleChildTest />)
console.log('   Result:', singleChildResult)
console.log('   Is Empty:', singleChildResult === '<DIV></DIV>')