// Debug test to see how JSX children are passed
import { renderToString } from 'woby/ssr'

// Test component that shows props
const DebugComponent = (props: any) => {
    console.log('DebugComponent props:', props)
    return <div>Debug Component</div>
}

// Test with one child
const OneChild = () => {
    return (
        <div>
            <DebugComponent>
                <h1>Single Child</h1>
            </DebugComponent>
        </div>
    )
}

// Test with multiple children
const MultiChild = () => {
    return (
        <div>
            <DebugComponent>
                <h1>Child 1</h1>
                <h2>Child 2</h2>
            </DebugComponent>
        </div>
    )
}

console.log('=== Testing One Child ===')
renderToString(<OneChild />)

console.log('\n=== Testing Multiple Children ===')
renderToString(<MultiChild />)