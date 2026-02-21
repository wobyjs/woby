/// @jsxImportSource woby
/// @jsxRuntime automatic

import { renderToString } from 'woby'

// This is actual JSX syntax
const ActualJSXTest = () => {
    return (
        <div>
            <h1>JSX Child 1</h1>
            <h2>JSX Child 2</h2>
            <div>
                <p>Nested child 1</p>
                <p>Nested child 2</p>
                <span>
                    <strong>Deeply nested child</strong>
                </span>
            </div>
        </div>
    )
}

console.log('Actual JSX Test:')
console.log(renderToString(<ActualJSXTest />))