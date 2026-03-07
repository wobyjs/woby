import { $, renderToString, type JSX } from 'woby'

const DebugPElement = (): JSX.Element => {
    const value = $(42)
    return (
        <p>Value: {value}</p>
    )
}

console.log('=== Debug P Element Test ===')
console.log(renderToString(<DebugPElement />))