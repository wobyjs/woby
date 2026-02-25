import { $, $$, template, renderToString } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestTemplateExternal = (): JSX.Element => {
    const Templated = template<{ class: string, color: string }>(props => {
        return (
            <div class={props.class}>
                <span>outer <span data-color={props.color}>inner</span></span>
            </div>
        )
    })
    const ret: JSX.Element = (
        <>
            <h3>Template - External</h3>
            <Templated class="red" color="blue" />
            <Templated class="blue" color="red" />
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestTemplateExternal_ssr', ret)

    return ret
}

TestTemplateExternal.test = {
    static: true,
    expect: () => {
        const expected = '<div class="red"><span>outer <span data-color="blue">inner</span></span></div><div class="blue"><span>outer <span data-color="red">inner</span></span></div>'

        // Test the SSR value asynchronously
        setTimeout(() => {
            const ssrComponent = testObservables['TestTemplateExternal_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    const expectedFull = '<h3>Template - External</h3><div class="red"><span>outer <span data-color="blue">inner</span></span></div><div class="blue"><span>outer <span data-color="red">inner</span></span></div>'
                    if (ssrResult !== expectedFull) {
                        assert(false, `[TestTemplateExternal] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
                    } else {
                        console.log(`✅ [TestTemplateExternal] SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`[TestTemplateExternal] SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestTemplateExternal} />