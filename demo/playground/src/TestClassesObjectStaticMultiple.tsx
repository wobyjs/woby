import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, runSSRTest } from './util'

const name = 'TestClassesObjectStaticMultiple'
const TestClassesObjectStaticMultiple = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Static Multiple</h3>
            <p class={{ 'red bold': true }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestClassesObjectStaticMultiple.test = {
    static: true,
    expect: () => {
        return '<p class="red bold">content</p>'
    }
}


export default () => <TestSnapshots Component={TestClassesObjectStaticMultiple} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestClassesObjectStaticMultiple)
