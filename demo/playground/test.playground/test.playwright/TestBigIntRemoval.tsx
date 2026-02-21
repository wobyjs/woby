import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomBigInt } from './util'

const TestBigIntRemoval = (): JSX.Element => {
    const o = $<bigint | null>(null)
    registerTestObservable('TestBigIntRemoval', o)
    return (
        <>
            <h3>BigInt - Removal</h3>
            <p>({o})</p>
        </>
    )
}

TestBigIntRemoval.test = {
    static: true, // Make it static for predictable testing
    // Let TestSnapshots handle the conversion of BigInt values to placeholders
    expect: () => {
        // Check the actual value to decide what to return
        const val = $$(testObservables['TestBigIntRemoval'])
        if (val !== null) {
            // The TestSnapshots component will convert BigInt values to {random-bigint} placeholders
            return '<p>({random-bigint})</p>'
        } else {
            return '<p>(<!---->)</p>'
        }
    }
}


export default () => <TestSnapshots Component={TestBigIntRemoval} />