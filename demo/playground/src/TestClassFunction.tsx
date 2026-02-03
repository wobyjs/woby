import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassFunction = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Class - Function Boolean</h3>
            <p class={{ red: () => o() }}>content</p>
        </>
    )
}

TestClassFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const o = $(true)
        const className = o() ? 'red' : 'blue'
        return `<p class="${className}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestClassFunction} />