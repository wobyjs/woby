import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestComponentObservableDirect = (): JSX.Element => {
    const getRandom = (): number => random()
    const o = $(getRandom())
    // Store the observable globally so the test can access it
    testObservables['TestComponentObservableDirect'] = o
    const randomize = () => o(getRandom())
    useInterval(randomize, TEST_INTERVAL)

    return (
        <>
            <h3>Component - Observable Direct</h3>
            <p>{o}</p>
        </>
    )
}

TestComponentObservableDirect.test = {
    static: false,  // Value almost always changes
    compareActualValues: true,
    expect: () => `<p>${$$(testObservables['TestComponentObservableDirect'])}</p>`
}



export default () => <TestSnapshots Component={TestComponentObservableDirect} />