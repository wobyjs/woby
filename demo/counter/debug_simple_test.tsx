/// @jsxImportSource ../../src/ssr
/// @jsxRuntime automatic

import { jsx } from '../../src/ssr'

// Directly test what jsx produces
const element = jsx('h1', null, "Custom element", jsx('br', null))
console.log('Direct jsx result:', element)

// Now test with renderToString
import { renderToString } from '../../src/ssr'

const BrTest = () => {
    return jsx('h1', null, "Custom element", jsx('br', null))
}

console.log('Testing <br/> element:')
const result = renderToString(<BrTest />)
console.log('Result:', result)
console.log('Expected: <H1>Custom element<BR></H1>')