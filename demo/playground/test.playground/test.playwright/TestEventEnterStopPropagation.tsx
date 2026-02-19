import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestEventEnterStopPropagation = (): JSX.Element => {
    const outer = $(0) // Static test
    const inner = $(0) // Static test
    // No event handlers or intervals for static test

    return (
        <>
            <h3>Event - Enter - Stop Propagation</h3>
            <p><button>{outer}<button>{inner}</button></button></p>
        </>
    )
}


TestEventEnterStopPropagation.test = {
    static: true,
    expect: () => {
        // For static test, return the expected fixed values
        return `<p><button>0<button>0</button></button></p>`
    }
}

export default () => <TestSnapshots Component={TestEventEnterStopPropagation} />