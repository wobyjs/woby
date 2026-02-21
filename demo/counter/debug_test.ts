import { jsx } from 'woby/ssr'

// Simple debug test
console.log('Testing jsx function directly:')

// Test with a simple div and text children
const result = jsx('div', null, 'Child 1', 'Child 2')

console.log('JSX result:', result)