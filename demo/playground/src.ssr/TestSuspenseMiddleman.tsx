import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseMiddleman = (): JSX.Element => {
    const Fallback = () => {
        return <p>Loading...</p>
    }
    const Content = () => {
        const o = $(0)
        const branch = $(false)
        const resource = useResource(() => {
            o()
            return new Promise<number>(resolve => {
                setTimeout(() => {
                    branch(true)
                }, TEST_INTERVAL / 2)
            })
        })
        const refetch = () => o(prev => prev + 1)
        useInterval(refetch, TEST_INTERVAL)
        return () => {
            if (branch()) return <p>Middleman!</p>
            return <p>Content! {resource.value}</p>
        }
    }
    return (
        <>
            <h3>Suspense - Middleman</h3>
            <Suspense fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseMiddleman.test = {
    static: false,
    expect: () => {
        // This component alternates between loading and middleman states
        const isMiddlemanState = Math.floor(Date.now() / TEST_INTERVAL) % 2 === 1
        return isMiddlemanState ? '<p>Middleman!</p>' : '<p>Loading...</p>'
    }
}


export default () => <TestSnapshots Component={TestSuspenseMiddleman} />