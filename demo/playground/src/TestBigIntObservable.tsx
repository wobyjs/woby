import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestBigIntObservable = (): JSX.Element => {
    const o = $(randomBigInt())
    const randomize = () => o(randomBigInt())
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>BigInt - Observable</h3>
            <p>{o}</p>
        </>
    )
}

TestBigIntObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const o = $(randomBigInt())
        return `<p>${$$(o)}</p>`
    }
}


export default () => <TestSnapshots Component={TestBigIntObservable} />