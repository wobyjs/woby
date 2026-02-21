import { renderToString, jsx } from 'woby/ssr'

// Simple jsx test
console.log('Testing jsx function directly:')

const result = jsx('div', null,
    jsx('h1', null, 'Child 1'),
    jsx('h2', null, 'Child 2')
)

console.log('JSX result:', result)

const rendered = renderToString(result)
console.log('Rendered result:', rendered)
console.log('Has children:', rendered.includes('Child 1') || rendered.includes('Child 2'))