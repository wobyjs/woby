/// @jsxImportSource woby
/// @jsxRuntime automatic

import { renderToString } from 'woby'

console.log('Testing simple <br/> element:')
const simpleResult = renderToString(<h1><br /></h1>)
console.log('Simple result:', simpleResult)

console.log('\nTesting text only:')
const textResult = renderToString(<h1>Custom element</h1>)
console.log('Text only result:', textResult)

console.log('\nTesting mixed:')
const mixedResult = renderToString(<h1>Custom element<br /></h1>)
console.log('Mixed result:', mixedResult)