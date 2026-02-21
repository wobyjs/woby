import { $, $$, Ternary } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestTernaryFunction = (): JSX.Element => {
    const o = $(true)
    registerTestObservable('TestTernaryFunction', o)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Ternary - Function</h3>
            <Ternary when={() => !o()}>
                <p>true</p>
                <p>false</p>
            </Ternary>
        </>
    )
}

TestTernaryFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = !testObservables['TestTernaryFunction']?.() // since it uses !o()
        return `<p>${value ? 'true' : 'false'}</p>`
    }
}


export default () => <TestSnapshots Component={TestTernaryFunction} />