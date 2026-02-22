import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestEventMiddleClickStatic = (): JSX.Element => {
    const o = $(0)
    const increment = () => o(prev => prev + 1)

    return (
        <>
            <h3>Event - Middle Click Static</h3>
            <p><button onMiddleClick={increment}>{o}</button></p>
        </>
    )
}


TestEventMiddleClickStatic.test = {
    static: true,
    expect: () => {
        const value = testObservables['TestEventMiddleClickStatic_o']?.() ?? 0
        // For static test, expect the initial value (0) since no updates should happen
        return `<p><button>0</button></p>`
    }
}

export default () => <TestSnapshots Component={TestEventMiddleClickStatic} />