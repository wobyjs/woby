import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesArrayCleanup = (): JSX.Element => {
    const o = $<string[]>(['red'])
    registerTestObservable('TestClassesArrayCleanup', o)
    const toggle = () => o(prev => prev[0] === 'red' ? ['blue'] : ['red'])
    useInterval(toggle, TEST_INTERVAL)
    const ret: JSX.Element = (
        <>
            <h3>Classes - Array Cleanup</h3>
            <p class={o}>content</p>
        </>
    )
    
    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayCleanup_ssr', ret)
    
    return ret
}

TestClassesArrayCleanup.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestClassesArrayCleanup'])
        return `<p class="${Array.isArray(value) ? value.filter(v => v).join(' ') : value}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestClassesArrayCleanup} />