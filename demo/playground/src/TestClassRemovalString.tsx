import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassRemovalString = (): JSX.Element => {
    const o = $<string | null>('red')
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassRemovalString', o)
    const toggle = () => o(prev => prev ? null : 'red')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Class - Removal String</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassRemovalString.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassRemovalString'])
        return value ? `<p class="${value}">content</p>` : '<p class="">content</p>'
    }
}


export default () => <TestSnapshots Component={TestClassRemovalString} />