import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassRemoval = (): JSX.Element => {
    const o = $<boolean | null>(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassRemoval', o)
    const toggle = () => o(prev => prev ? null : true)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Class - Removal</h3>
            <p class={{ red: o }}>content</p>
        </>
    )
}

TestClassRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassRemoval'])
        return value ? '<p class="red">content</p>' : '<p class="">content</p>'
    }
}


export default () => <TestSnapshots Component={TestClassRemoval} />