import { ErrorBoundary, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, runSSRTest } from './util'

// A throwing function child sitting among siblings: SSR resolves such arrays eagerly in
// setChildStatic. That step used to catch the throw, console.error
// "[setChildStatic] Failed to resolve function", and hand the function back — which then ran
// a SECOND time further down, where it finally reached the ErrorBoundary. The output looked
// right, but every throwing child ran twice and logged a stray error in production SSR.
const name = 'TestErrorBoundarySiblings'
let ssrCalls = 0
const TestErrorBoundarySiblings = (): JSX.Element => {
    const Fallback = ({ error }): JSX.Element => {
        return <p>Error caught: {error.message}</p>
    }
    const ret: JSX.Element = () => (
        <>
            <h3>Error Boundary (siblings)</h3>
            <ErrorBoundary fallback={Fallback}>
                <div>
                    <p>before</p>
                    {() => { ssrCalls++; throw new Error('Sibling error') }}
                </div>
            </ErrorBoundary>
        </>
    )

    registerTestObservable(`${name}_ssr`, ret)

    return ret
}


TestErrorBoundarySiblings.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const expectedFull = '<h3>Error Boundary (siblings)</h3><p>Error caught: Sibling error</p>'
        const expected = '<p>Error caught: Sibling error</p>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const before = ssrCalls
        const ssrResult = renderToString(ssrComponent)
        const calls = ssrCalls - before
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else if (calls !== 1) {
            assert(false, `[${name}] SSR ran the throwing child ${calls}× (expected 1)`)
        } else {
            console.log(`✅ [${name}] SSR test passed (throwing child ran once): ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestErrorBoundarySiblings} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestErrorBoundarySiblings)
