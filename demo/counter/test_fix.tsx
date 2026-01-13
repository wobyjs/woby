/// @jsxImportSource woby
/// @jsxRuntime automatic

/**
 * Test to verify the fix for double child issue and br tag handling
 */

import { renderToString, jsx } from '../../src/ssr'

// Test with JSX syntax
const JSXTest = () => {
    return (
        <div>
            <h1>JSX Child 1</h1>
            <h1>JSX Child 2</h1>
            <div>
                <p>Nested child 1</p>
                <p>Nested child 2</p>
                <span>
                    <strong>Deeply nested child</strong>
                </span>
            </div>
        </div>
    )
}

// Test with direct jsx() calls (React 17 style - FIXED)
const DirectTest17 = () => {
    return jsx('div', {
        children: [
            jsx('h1', { children: 'Direct Child 1' }),
            jsx('h2', { children: 'Direct Child 2' }),
            jsx('div', {
                children: [
                    jsx('p', { children: 'Nested child 1' }),
                    jsx('p', { children: 'Nested child 2' }),
                    jsx('span', {
                        children: jsx('strong', { children: 'Deeply nested child' })
                    })
                ]
            })
        ]
    })
}

// Test with jsx() calls in React 16 style
const DirectTest16 = () => {
    return jsx('div', null,
        jsx('h1', null, 'Direct Child 1'),
        jsx('h2', null, 'Direct Child 2')
    )
}

// Test with br tag
const BrTagTest = () => {
    return (
        <div>
            <p>Line 1<br /></p>
            <p>Line 2<br />Line 3</p>
        </div>
    )
}

console.log('=== Testing fixes ===\n')

console.log('1. JSX Syntax Test:')
const jsxResult = renderToString(<JSXTest />)
console.log('   Result:', jsxResult)

console.log('\n2. Direct jsx() Calls Test (React 17 style):')
const directResult17 = renderToString(<DirectTest17 />)
console.log('   Result:', directResult17)

console.log('\n3. Direct jsx() Calls Test (React 16 style):')
const directResult16 = renderToString(<DirectTest16 />)
console.log('   Result:', directResult16)

console.log('\n4. BR Tag Test:')
const brResult = renderToString(<BrTagTest />)
console.log('   Result:', brResult)

console.log('\n=== Analysis ===')
console.log('JSX has correct structure:', jsxResult.includes('<H1>JSX Child 1</H1>') && jsxResult.includes('<H2>JSX Child 2</H2>'))
console.log('React 17 style works:', directResult17.includes('<H1>Direct Child 1</H1>') && directResult17.includes('<H2>Direct Child 2</H2>'))
console.log('React 16 style works:', directResult16.includes('<H1>Direct Child 1</H1>') && directResult16.includes('<H2>Direct Child 2</H2>'))
console.log('BR tags are self-closing:', brResult.includes('<BR>') && !brResult.includes('</BR>'))