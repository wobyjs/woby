/// @jsxImportSource woby
/// @jsxRuntime automatic

import { jsx, renderToString } from 'woby'

// This is how JSX should be transpiled
const JSXTranspiledTest = () => {
    return jsx('div', null,
        jsx('h1', null, 'JSX Child 1'),
        jsx('h2', null, 'JSX Child 2'),
        jsx('div', null,
            jsx('p', null, 'Nested child 1'),
            jsx('p', null, 'Nested child 2'),
            jsx('span', null,
                jsx('strong', null, 'Deeply nested child')
            )
        )
    )
}

console.log('JSX Transpiled Test:')
console.log(renderToString(JSXTranspiledTest()))