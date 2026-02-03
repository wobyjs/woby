import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestBigIntFunction = (): JSX.Element => {
    const o = $(randomBigInt())
    const randomize = () => o(randomBigInt())
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>BigInt - Function</h3>
            <p>{() => o()}</p>
        </>
    )
}

TestBigIntFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const o = $(randomBigInt())
        return `<p>${$$(o)}</p>`
    }
}


export default () => <TestSnapshots Component={TestBigIntFunction} />