/// @jsxImportSource ../../src/ssr
/// @jsxRuntime automatic

import { renderToString } from '../../src/ssr'
// import { renderToString } from 'woby'

// Direct test without function component
console.log('Direct JSX test:')
const directJsx = <h1>Custom element<br /></h1>
console.log('directJsx:', directJsx)
const result = renderToString(directJsx)
console.log('Result:', result)
