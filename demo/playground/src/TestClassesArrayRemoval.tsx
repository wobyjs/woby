import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayRemoval = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Class> | null>(['red', false])
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesArrayRemoval', o)
    const toggle = () => o(prev => prev ? null : ['red', false])
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Array Removal</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesArrayRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayRemoval'])
        return value ? `<p class="${Array.isArray(value) ? value.join(' ') : value}">content</p>` : '<p class="">content</p>'
    }
}


export default () => <TestSnapshots Component={TestClassesArrayRemoval} />