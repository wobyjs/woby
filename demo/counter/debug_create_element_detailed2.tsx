import { renderToString, jsx } from 'woby/ssr'

// Test with JSX syntax that has children in props
const JSXTest = () => {
    // This simulates what JSX does now - children in props with SYMBOL_JSX
    const propsWithChildrenAndSymbol = {
        children: [
            jsx('h1', { children: 'JSX Child 1' }),
            jsx('h2', { children: 'JSX Child 2' })
        ]
    }
    propsWithChildrenAndSymbol[Symbol('Jsx')] = true

    return jsx('div', propsWithChildrenAndSymbol)
}

// Test with direct jsx() calls that has children in props but no SYMBOL_JSX
const DirectTest = () => {
    return jsx('div', {
        children: [
            jsx('h1', { children: 'Direct Child 1' }),
            jsx('h2', { children: 'Direct Child 2' })
        ]
    })
}

console.log('=== Detailed Debug ===\n')

console.log('1. JSX Test with SYMBOL_JSX:')
const jsxElement = JSXTest()
console.log('JSX Element:', jsxElement)

const jsxResult = renderToString(jsxElement)
console.log('JSX Result:', jsxResult)

console.log('\n2. Direct Test without SYMBOL_JSX:')
const directElement = DirectTest()
console.log('Direct Element:', directElement)

const directResult = renderToString(directElement)
console.log('Direct Result:', directResult)

console.log('\n=== Analysis ===')
console.log('JSX Result Empty:', jsxResult === '<DIV></DIV>')
console.log('Direct Result Has Children:', directResult.includes('<H1>') && directResult.includes('<H2>'))