// Final test demonstrating the double child issue fix
import { renderToString, createElement } from 'woby/ssr'

// Test with createElement syntax (equivalent to JSX)
const JSXTest = () => {
    return createElement('div', null,
        createElement('h1', null, 'JSX Child 1'),
        createElement('h2', null, 'JSX Child 2')
    )
}

// Test with direct createElement calls (CORRECT way)
const DirectTestFixed = () => {
    return createElement('div', null,
        createElement('h1', null, 'Direct Child 1'),
        createElement('h2', null, 'Direct Child 2')
    )
}

// Test with direct createElement calls (INCORRECT way - causes double child issue)
const DirectTestBroken = () => {
    return createElement('div', {
        children: [
            createElement('h1', { children: 'Direct Child 1' }),
            createElement('h2', { children: 'Direct Child 2' })
        ]
    } as any)
}

console.log('=== JSX vs Direct createElement() Comparison ===\n')

console.log('1. JSX Syntax Test (using createElement):')
const jsxResult = renderToString(JSXTest())
console.log('   Result:', jsxResult)

console.log('\n2. Direct createElement() Calls Test (Fixed):')
const directResult = renderToString(DirectTestFixed())
console.log('   Result:', directResult)

console.log('\n3. Direct createElement() Calls Test (Broken - Double Child Issue):')
const brokenResult = renderToString(DirectTestBroken())
console.log('   Result:', brokenResult)

console.log('\n=== Analysis ===')
console.log('JSX Result Has Children:', jsxResult.includes('<H1>') && jsxResult.includes('<H2>'))
console.log('Fixed Direct Result Has Children:', directResult.includes('<H1>') && directResult.includes('<H2>'))
console.log('Broken Direct Result Has Double Children:', (brokenResult.match(/Direct Child/g) || []).length > 4)

console.log('\n=== Explanation ===')
console.log('The double child issue occurs when:')
console.log('1. Children are passed as a "children" property in the props object')
console.log('2. Those children also have their own "children" property')
console.log('3. This creates a double nesting effect where children are rendered twice')
console.log('')
console.log('Always use the correct signature:')
console.log('createElement(component, props, ...children)')
console.log('instead of putting children in the props object.')