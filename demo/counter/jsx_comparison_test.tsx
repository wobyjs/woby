/// @jsxImportSource ../../src/ssr
/// @jsxRuntime automatic

import { renderToString, jsx } from '../../src/ssr'
// import { renderToString } from 'woby'

// Test with JSX syntax
const JSXTest = () => {
    return (
        <div>
            <h1>JSX Child 1</h1>
            <h2>JSX Child 2</h2>
            <h1>Custom element<br /></h1>
            <h1>&lt;counter-element&gt; - &lt;counter-element&gt;:<br /></h1>
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

console.log('=== JSX vs Direct jsx() Comparison ===\n')

console.log('1. JSX Syntax Test:')
const jsxResult = renderToString(<JSXTest />)
console.log('   Result:', jsxResult)


console.log('\n2. Direct jsx() Calls Test React 17:')
const directResult17 = renderToString(<DirectTest17 />)
console.log('   Result:', directResult17)

