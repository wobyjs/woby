import { $, $$, renderToString, useEffect, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, runSSRTest } from './util'

const name = 'TestClassesObjectRemoval'
const TestClassesObjectRemoval = (): JSX.Element => {
    const o = $<JSX.Class | null>({ red: true, blue: false })
    // Store the observable globally so the test can access it
    registerTestObservable('TestClassesObjectRemoval', o)

    // Add logging for state changes

    const toggle = () => {
        const newState = o(prev => prev ? null : { red: true, blue: false })
        return newState
    }
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Removal</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestClassesObjectRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables[name])
        let expected: string
        if (value) {
            let className = ''
            if (value.red) className += 'red '
            if (value.blue) className += 'blue '
            expected = `<p class="${className.trim()}">content</p>`
        } else {
            expected = '<p class="">content</p>'
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectRemoval} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestClassesObjectRemoval)
