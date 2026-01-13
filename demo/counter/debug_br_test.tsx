/// @jsxImportSource ../../src/ssr
/// @jsxRuntime automatic

import { renderToString } from '../../src/ssr'

const BrTest = () => {
    return <h1>Custom element<br /></h1>
}

console.log('Testing <br/> element:')
const result = renderToString(<BrTest />)
console.log('Result:', result)
console.log('Expected: <H1>Custom element<BR></H1>')