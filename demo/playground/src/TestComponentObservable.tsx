import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestComponentObservable = (): JSX.Element => {
    const getRandom = (): number => random()
    const o = $(getRandom())
    // Store the observable globally so the test can access it
    registerTestObservable('TestComponentObservable', o)
    const randomize = () => o(getRandom())
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>Component - Observable</h3>
            <p>{o}</p>
        </>
    )
}

TestComponentObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => `<p>${$$(testObservables['TestComponentObservable'])}</p>`
}


export default () => <TestSnapshots Component={TestComponentObservable} />