import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestComponentObservableDirect = (): JSX.Element => {
    const getRandom = (): number => random()
    const o = $(getRandom())
    registerTestObservable('TestComponentObservableDirect', o)
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
    static: false,
    compareActualValues: true,
    expect: () => `<p>${$$(testObservables['TestComponentObservableDirect'])}</p>`
}



export default () => <TestSnapshots Component={TestComponentObservableDirect} />