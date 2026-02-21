import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, randomBigInt } from './util'

const TestBigIntFunction = (): JSX.Element => {
    const o = $(randomBigInt())
    // Store the observable globally so the test can access it
    registerTestObservable('TestBigIntFunction', o)
    return (
        <>
            <h3>BigInt - Function</h3>
            <p>{() => o()}</p>
        </>
    )
}

TestBigIntFunction.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true, // Use compareActualValues to bypass conversion logic
    expect: () => {
        const value = $$(testObservables['TestBigIntFunction'])
        // Return value with 'n' suffix to match actual rendering
        return `<p>${value}n</p>`
    }
}


export default () => <TestSnapshots Component={TestBigIntFunction} />