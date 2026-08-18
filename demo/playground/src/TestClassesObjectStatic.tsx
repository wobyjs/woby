import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert, runSSRTest } from './util'

const name = 'TestClassesObjectStatic'
const TestClassesObjectStatic = (): JSX.Element => {
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Object Static</h3>
            <p class={{ red: true, blue: false }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestClassesObjectStatic.test = {
    static: true,
    expect: () => {
        return '<p class="red">content</p>'
    }
}


export default () => <TestSnapshots Component={TestClassesObjectStatic} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
if (typeof window === 'undefined') runSSRTest(name, TestClassesObjectStatic)
