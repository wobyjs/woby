import { $, $$, If, renderToString, type JSX } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables, assert, runSSRTest } from './util'

let ins = 0
export const TestCleanupInner = () => {
    const name = 'TestCleanupInner' + (ins++)

    // NOTE: this factory used to pre-register `${name}_ssr` from a throwaway clone of the
    // component here. That only worked while nothing ever rendered TestCleanupInner1 — the
    // real body registers the same key on its last line, so the moment the component is
    // actually mounted (TestCleanupInnerPortal renders it through a <Portal>) the two
    // registrations collided and registerTestObservable threw. runSSRTest already constructs
    // the component when `${name}_ssr` is missing, so the clone was redundant as well.

    const TestCleanupInner1 = (): JSX.Element => {
        const page = $(true)
        registerTestObservable(name, page)
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
        registerTestObservable(`${name}_ssr`, ret)

        return ret
    }

    TestCleanupInner1.test = {
        static: true,
        compareActualValues: true,
        expect: () => {
            const expectedFull = '<h3>Cleanup - Inner</h3><p>page1</p><button>Toggle Page</button>'
            const expected = '<p>page1</p><button>Toggle Page</button>'

            const ssrComponent = testObservables[`${name}_ssr`]
            const ssrResult = renderToString(ssrComponent)
            if (ssrResult !== expectedFull) {
                assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
            } else {
                console.log(`✅ [${name}] SSR test passed: ${ssrResult}`)
            }

            return expected
        }
    }

    return TestCleanupInner1
}

export default () => <TestSnapshots Component={TestCleanupInner()} />

// SSR assertions, driven on the same schedule the browser's <TestSnapshots> uses.
// Key off the component's own name — <TestSnapshots> tallies by Component.name, which is the
// inner TestCleanupInner1 regardless of how many times the factory has run. Hardcoding the
// factory's per-instance name ('TestCleanupInner0') made the two suites report different rows
// for the same test.
if (typeof window === 'undefined') {
    const Component = TestCleanupInner()
    runSSRTest(Component.name, Component)
}