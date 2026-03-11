import { $, $$, createContext, useContext, renderToString, tick, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

let syncStep = 0
const TestRefContext = (): JSX.Element => {
    const message = $('')
    const Context = createContext(123)

    const Reffed = (): JSX.Element => {
        const ref = (element: HTMLElement) => {
            if (element) {
                // console.log('syncStep', syncStep++)
                // console.log('syncStep: element', element)
                message(`Got ref - Has parent: ${!!element.parentElement} - Is connected: ${element.isConnected} - Context: ${useContext(Context)}`)
            }
        }
        return <p ref={ref}>{message}</p>
    }
    const ret = () => (
        <>
            <h3>Ref - Context</h3>
            <Context.Provider value={321}>
                <Reffed />
            </Context.Provider>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestRefContext_ssr', ret)

    return ret
}

TestRefContext.test = {
    static: false,
    expect: () => {
        // Define expected values for both main test and SSR test
        // Note: SSR doesn't render symbol attributes
        const expectedFull = '<h3>Ref - Context</h3><context-provider value="321"><p>Got ref - Has parent: false - Is connected: false - Context: 321</p></context-provider>'  // For SSR comparison
        const expected = [
            '<context-provider value="321"><p>Got ref - Has parent: true - Is connected: true - Context: 321</p></context-provider>',   // For main DOM test comparison
            '<context-provider value="321"><p>Got ref - Has parent: false - Is connected: false - Context: 321</p></context-provider>',   // For main DOM test comparison
        ]

        const ssrComponent = testObservables['TestRefContext_ssr']
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[TestRefContext] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestRefContext] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestRefContext} />

const ts = <TestRefContext />
console.log(renderToString(ts))

tick()
tick()
tick()
console.log(renderToString(ts))
