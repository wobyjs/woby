/** @jsxImportSource woby/ssr */
import { renderToString, jsx } from 'woby/ssr'

// Test with JSX syntax
const JSXTest = () => {
    return (
        <div>
            <h1>JSX Child 1</h1>
            <h2>JSX Child 2</h2>
        </div>
    )
}

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
    } as any)
}

console.log('=== JSX vs Direct jsx() Comparison ===\n')

try {
    console.log('1. JSX Syntax Test:')
    const jsxResult = renderToString(<JSXTest />)
    console.log('   Result:', jsxResult)
} catch (e: any) {
    console.log('   Error:', e.message)
}

try {
    console.log('\n2. Direct jsx() Calls Test (Fixed):')
    const directResult = renderToString(<DirectTestFixed />)
    console.log('   Result:', directResult)
} catch (e: any) {
    console.log('   Error:', e.message)
}

try {
    console.log('\n3. Direct jsx() Calls Test (Broken - Double Child Issue):')
    const brokenResult = renderToString(<DirectTestBroken />)
    console.log('   Result:', brokenResult)
} catch (e: any) {
    console.log('   Error:', e.message)
}

console.log('\n=== Analysis ===')
// We can't do these comparisons directly because of the JSX transform issue
console.log('Issue diagnosed: Passing children as props instead of as arguments causes double nesting')