import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleRemoval = (): JSX.Element => {
    const o = $<string | null>('green')
    // Store the observable globally so the test can access it
    registerTestObservable('TestStyleRemoval', o)
    const toggle = () => o(prev => prev ? null : 'green')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Style - Removal</h3>
            <p style={{ color: o }}>content</p>
        </>
    )
}

TestStyleRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestStyleRemoval'])
        return value ? `<p style="color: ${value};">content</p>` : '<p style="">content</p>'
    }
}


export default () => <TestSnapshots Component={TestStyleRemoval} />