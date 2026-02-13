import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestABCD = (): JSX.Element => {
    const states = [
        <i>a</i>,
        <u>b</u>,
        <b>c</b>,
        <span>d</span>
    ]
    const index = $(0)
    // Store the observable globally so the test can access it
    registerTestObservable('TestABCD', index)
    const increment = () => index(prev => (prev + 1) % states.length)
    useInterval(increment, TEST_INTERVAL)
    return (
        <>
            <h3>Children - ABCD</h3>
            <p>{() => states[index()]}</p>
        </>
    )
}

TestABCD.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const idx = $$(testObservables['TestABCD'])
        const elements = ['<p><i>a</i></p>', '<p><u>b</u></p>', '<p><b>c</b></p>', '<p><span>d</span></p>']
        return elements[idx]
    }
}


export default () => <TestSnapshots Component={TestABCD} />