/// @jsxImportSource woby/ssr

import { renderToString } from 'woby/ssr'

const SimpleJSXTest = () => {
    return (
        <div>
            <h1>Simple JSX Child</h1>
        </div>
    )
}

console.log('Simple JSX Test:')
const result = renderToString(<SimpleJSXTest />)
console.log('Result:', result)