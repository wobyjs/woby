import { $, $$, createContext, useContext, renderToString, tick, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, minimiseHtml } from './util'

let syncStep = 0
const name = 'TestRefContext'
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
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestRefContext.test = {
    static: false,
    expect: () => {
        // Define expected values for both main test and SSR test
        // Note: SSR doesn't render symbol attributes
        const expectedFull = minimiseHtml( '<h3>Ref - Context</h3><p>Got ref - Has parent: false - Is connected: false - Context: 321</p>' ) // For SSR comparison
        const expected = [
            minimiseHtml('<p>Got ref - Has parent: true - Is connected: true - Context: 321</p>'),   // For main DOM test comparison
            minimiseHtml('<p>Got ref - Has parent: false - Is connected: false - Context: 321</p>'),   // For main DOM test comparison
        ]

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
        }

        return expected  // This is what the DOM test framework compares against
    }
}


export default () => <TestSnapshots Component={TestRefContext} />

// const ts = <TestRefContext />
// console.log(renderToString(ts))

// tick()
// tick()
// tick()
// console.log(renderToString(ts))
