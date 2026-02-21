import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomBigInt } from './util'

const TestBigIntObservable = (): JSX.Element => {
    const o = $(randomBigInt())
    // Store the observable globally so the test can access it
    registerTestObservable('TestBigIntObservable', o)
    return (
        <>
            <h3>BigInt - Observable</h3>
            <p>{o}</p>
        </>
    )
}

TestBigIntObservable.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true, // Use compareActualValues to bypass conversion logic
    expect: () => {
        const value = $$(testObservables['TestBigIntObservable'])
        // Return value without 'n' suffix to match actual rendering
        return `<p>${value}</p>`
    }
}


export default () => <TestSnapshots Component={TestBigIntObservable} />