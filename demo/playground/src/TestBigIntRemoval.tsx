import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestBigIntRemoval = (): JSX.Element => {
    const o = $<bigint | null>(null)
    registerTestObservable('TestBigIntRemoval', o)
    const randomize = () => o(prev => prev ? null : randomBigInt())
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>BigInt - Removal</h3>
            <p>({o})</p>
        </>
    )
}

TestBigIntRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables['TestBigIntRemoval'])
        return val !== null ? `<p>(${val})</p>` : '<p>(<!---->)</p>'
    }
}


export default () => <TestSnapshots Component={TestBigIntRemoval} />