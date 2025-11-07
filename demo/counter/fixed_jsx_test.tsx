/// <reference types="woby/ssr" />
/** @jsxImportSource woby/ssr */

/**
 * Fixed test to compare JSX syntax vs direct jsx() calls
 */

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

// Test with direct jsx() calls (FIXED)
const DirectTest = () => {
    return jsx('div', null,
        jsx('h1', null, 'Direct Child 1'),
        jsx('h2', null, 'Direct Child 2')
    )
}

console.log('=== JSX vs Direct jsx() Comparison ===\n')

console.log('1. JSX Syntax Test:')
const jsxResult = renderToString(<JSXTest />)
console.log('   Result:', jsxResult)

console.log('\n2. Direct jsx() Calls Test:')
const directResult = renderToString(<DirectTest />)
console.log('   Result:', directResult)

console.log('\n=== Analysis ===')
console.log('JSX Result Empty:', jsxResult === '<DIV></DIV>')
console.log('Direct Result Has Children:', directResult.includes('<H1>') && directResult.includes('<H2>'))