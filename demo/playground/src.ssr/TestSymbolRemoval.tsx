import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSymbolRemoval = (): JSX.Element => {
    const o = $<symbol | null>(Symbol())
    // Store the observable globally so the test can access it
    registerTestObservable('TestSymbolRemoval', o)
    const randomize = () => o(prev => prev ? null : Symbol())
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>Symbol - Removal</h3>
            <p>({o})</p>
        </>
    )
}

TestSymbolRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestSymbolRemoval'])
        return value !== null ? '<p>(!----!)</p>' : '<p>()</p>'
    }
}


export default () => <TestSnapshots Component={TestSymbolRemoval} />