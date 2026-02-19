import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfFallbackObservable = (): JSX.Element => {
    const Fallback = () => {
        const o = $(String(random()))
        registerTestObservable('TestIfFallbackObservable', o)
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        return <p>Fallback: {o}</p>
    }
    return (
        <>
            <h3>If - Fallback Observable</h3>
            <If when={false} fallback={<Fallback />}>Children</If>
        </>
    )
}

TestIfFallbackObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => `<p>Fallback: ${$$(testObservables['TestIfFallbackObservable'])}</p>`
}


export default () => <TestSnapshots Component={TestIfFallbackObservable} />