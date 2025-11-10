/// @jsxImportSource woby
/// @jsxRuntime automatic

import { renderToString, jsx } from 'woby'

// Test with empty children in props (React 17 style)
const EmptyChildTest17 = () => {
    return jsx('div', {
        children: []
    })
}

// Test with no children at all
const NoChildTest = () => {
    return jsx('div', {})
}

// Test with undefined children
const UndefinedChildTest = () => {
    return jsx('div', {
        children: undefined
    })
}

console.log('=== Empty Child Tests ===\n')

console.log('1. Empty Array Children (React 17):')
const emptyArrayResult = renderToString(<EmptyChildTest17 />)
console.log('   Result:', emptyArrayResult)

console.log('\n2. No Children:')
const noChildResult = renderToString(<NoChildTest />)
console.log('   Result:', noChildResult)

console.log('\n3. Undefined Children:')
const undefinedChildResult = renderToString(<UndefinedChildTest />)
console.log('   Result:', undefinedChildResult)