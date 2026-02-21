import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestTabIndexBooleanFunction = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>TabIndex - Boolean - Function</h3>
            <p tabIndex={() => o()}>content</p>
        </>
    )
}

TestTabIndexBooleanFunction.test = {
    static: false,
    expect: () => {
        // This component toggles between tabindex="0" and no tabindex
        const hasTabIndex = Math.random() > 0.5
        return hasTabIndex ? '<p tabindex="0">content</p>' : '<p>content</p>'
    }
}


export default () => <TestSnapshots Component={TestTabIndexBooleanFunction} />