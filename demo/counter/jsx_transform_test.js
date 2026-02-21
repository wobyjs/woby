// Test to see how JSX is transformed
import { jsx } from 'woby/ssr'

// This simulates what JSX transformation produces
const JSXTransformed = () => {
    // This is what JSX syntax gets transformed to:
    return jsx('div', null,
        jsx('h1', null, 'JSX Child 1'),
        jsx('h2', null, 'JSX Child 2')
    )
}

console.log('JSX Transformation Test:')
console.log('JSXTransformed function:', JSXTransformed.toString())