import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestComponentFunction = (): JSX.Element => {
    const getRandom = (): number => random()
    const o = $(getRandom())
    // Store the observable globally so the test can access it
    registerTestObservable('TestComponentFunction', o)
    const randomize = () => o(getRandom())
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>Component - Function</h3>
            <p>{() => o()}</p>
        </>
    )
}

TestComponentFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => `<p>${$$(testObservables['TestComponentFunction'])}</p>`
}


export default () => <TestSnapshots Component={TestComponentFunction} />