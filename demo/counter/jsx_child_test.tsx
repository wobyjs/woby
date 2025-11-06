// Test JSX child rendering functionality
import { renderToString } from 'woby/ssr'

// Test component with multiple children
const MultiChildComponent = () => {
    return (
        <div>
            <h1>First Child</h1>
            <p>Second Child</p>
            <span>Third Child</span>
        </div>
    )
}

// Test component with single child
const SingleChildComponent = () => {
    return (
        <div>
            <h1>Single Child</h1>
        </div>
    )
}

console.log('Testing JSX child rendering...')

// Test single child
console.log('Single child test:')
const singleResult = renderToString(<SingleChildComponent />)
console.log(singleResult)

console.log('\nMultiple children test:')
const multiResult = renderToString(<MultiChildComponent />)
console.log(multiResult)

console.log('\n--- End of tests ---')