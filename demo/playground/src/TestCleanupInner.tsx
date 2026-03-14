import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

export const TestCleanupInner = () => {
    const page = $(true)
    registerTestObservable('TestCleanupInner', page)
    const togglePage = () => page(prev => !prev)
    const Page1 = () => {
        // Remove dynamic behavior for static test
        // useTimeout(togglePage, TEST_INTERVAL)
        return (
            <>
                <p>page1</p>
                <button onClick={togglePage}>Toggle Page</button>
            </>
        )
    }
    const Page2 = () => {
        const bool = $(true)
        const toggle = () => bool(prev => !prev)
        // Remove dynamic behavior for static test
        // useTimeout(toggle, TEST_INTERVAL)
        // useTimeout(togglePage, TEST_INTERVAL * 2)
        return (
            <>
                <If when={bool}>
                    <p>page2 - true</p>
                </If>
                <If when={() => !bool()}>
                    <p>page2 - false</p>
                </If>
                <button onClick={toggle}>Toggle</button>
                <button onClick={togglePage}>Toggle Page</button>
            </>
        )
    }
    const ret = () => {
        const Page = page() ? Page1 : Page2
        return (
            <>
                <h3>Cleanup - Inner</h3>
                <Page />
            </>
        )
    }

    // Store the component for SSR testing
    registerTestObservable('TestCleanupInner_ssr', ret)

    return ret
}

TestCleanupInner.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const expectedFull = '<h3>Cleanup - Inner</h3><p>page1</p><button>Toggle Page</button>'
        const expected = '<p>page1</p><button>Toggle Page</button>'

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestCleanupInner} />

// console.log(renderToString(<TestCleanupInner />))