// Simple JSX test
import { renderToString } from 'woby/ssr'

// Simple component with one child
const SimpleComponent = () => {
    return (
        <div>
            <h1>Hello World</h1>
        </div>
    )
}

console.log('Testing simple JSX rendering...')
const result = renderToString(<SimpleComponent />)
console.log('Result:', result)
console.log('--- End of test ---')