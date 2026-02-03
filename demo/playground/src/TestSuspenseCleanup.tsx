import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseCleanup = (): JSX.Element => {
    const ChildrenLoop = () => {
        const resource = useResource(() => {
            return new Promise<undefined>(() => { })
        })
        return <p>Loop! {resource.value}</p>
    }
    const ChildrenPlain = () => {
        return <p>Loaded!</p>
    }
    const Children = (): JSX.Element => {
        const o = $(true)
        // Store the observable globally so the test can access it
        registerTestObservable('TestSuspenseCleanup', o)
        const toggle = () => o(prev => !prev)
        setTimeout(toggle, TEST_INTERVAL)
        return (
            <Ternary when={o}>
                <ChildrenLoop />
                <ChildrenPlain />
            </Ternary>
        )
    }
    const Fallback = (): JSX.Element => {
        return <p>Loading...</p>
    }
    return (
        <>
            <h3>Suspense - Cleanup</h3>
            <Suspense fallback={<Fallback />}>
                <Children />
            </Suspense>
        </>
    )
}

TestSuspenseCleanup.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        // This component alternates between loading and loaded states
        const o = $$(testObservables['TestSuspenseCleanup'])
        return o ? '<p>Loaded!</p>' : '<p>Loading...</p>'
    }
}


export default () => <TestSnapshots Component={TestSuspenseCleanup} />