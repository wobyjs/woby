import { $, renderToString, type JSX } from 'woby'

const name = 'DebugPElement'
const DebugPElement = (): JSX.Element => {
    const value = $(42)
    return (
        <p>Value: {value}</p>
    )
}

// console.log(renderToString(<DebugPElement />))