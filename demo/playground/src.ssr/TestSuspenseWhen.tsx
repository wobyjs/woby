import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseWhen = (): JSX.Element => {
    const suspenseObservable = $(0)
    const Fallback = () => {
        return <p onClick={() => suspenseObservable(1)}>Loading...</p>
    }
    const Content = () => {
        return <p onClick={() => suspenseObservable(0)}>Content!</p>
    }
    const o = $(true)
    // Store the observable globally so the test can access it
    registerTestObservable('TestSuspenseWhen', o)
    registerTestObservable('TestSuspenseWhen_state', suspenseObservable)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Suspense - When</h3>
            <Suspense when={o} fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseWhen.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const isVisible = $$(testObservables['TestSuspenseWhen'])
        return isVisible ? '<p>Content!</p>' : '<p>Loading...</p>'
    }
}


export default () => <TestSnapshots Component={TestSuspenseWhen} />