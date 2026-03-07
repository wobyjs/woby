import { $, $$, renderToString, type JSX } from 'woby'
import { TestSnapshots, assert, registerTestObservable } from './util'

const TestClassesArrayStore = (): JSX.Element => {
    const o = ['red', false]
    const ret: JSX.Element = () => (
        <>
            <h3>Classes - Array Store</h3>
            <p class={o}>content</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestClassesArrayStore_ssr', ret)

    return ret
}

TestClassesArrayStore.test = {
    static: true,
    expect: () => {
        const expected = '<p class="red">content</p>'

        const ssrComponent = testObservables['TestClassesArrayStore_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = `<h3>Classes - Array Store</h3>${expected}`
        if (ssrResult !== expectedFull) {
            assert(false, `[TestClassesArrayStore] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestClassesArrayStore] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestClassesArrayStore} />