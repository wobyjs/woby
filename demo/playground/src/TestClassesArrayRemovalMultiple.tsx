import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesArrayRemovalMultiple = (): JSX.Element => {
    const o = $<FunctionUnwrap<JSX.Class> | null>(['red bold', false])
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesArrayRemovalMultiple', o)
    const toggle = () => o(prev => prev ? null : ['red bold', false])
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Array Removal Multiple</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesArrayRemovalMultiple.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayRemovalMultiple'])
        return value ? `<p class="${Array.isArray(value) ? value.join(' ') : value}">content</p>` : '<p class="">content</p>'
    }
}


export default () => <TestSnapshots Component={TestClassesArrayRemovalMultiple} />