import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIdRemoval = (): JSX.Element => {
    const o = $<string | null>('foo')
    // Store the observable globally so the test can access it
    registerTestObservable('TestIdRemoval', o)
    const toggle = () => o(prev => prev ? null : 'foo')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>ID - Removal</h3>
            <p id={o}>content</p>
        </>
    )
}

TestIdRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestIdRemoval'])
        return value ? `<p id="${value}">content</p>` : '<p id="">content</p>'
    }
}


export default () => <TestSnapshots Component={TestIdRemoval} />