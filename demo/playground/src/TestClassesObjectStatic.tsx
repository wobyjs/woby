import { $, $$, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestClassesObjectStatic = (): JSX.Element => {
    const ret: JSX.Element = (
        <>
            <h3>Classes - Object Static</h3>
            <p class={{ red: true, blue: false }}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesObjectStatic_ssr', ret)

    return ret
}

TestClassesObjectStatic.test = {
    static: true,
    expect: () => {
        const expected = '<p class="red">content</p>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestClassesObjectStatic_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = `<h3>Classes - Object Static</h3>${expected}`
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestClassesObjectStatic] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestClassesObjectStatic] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestClassesObjectStatic] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesObjectStatic} />