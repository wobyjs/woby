import { $, $$, template, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestTemplateExternal = (): JSX.Element => {
    const ret: JSX.Element = () => {
        const Templated = template<{ class: string, color: string }>(props => {
            return (
                <div class={props.class}>
                    <span>outer <span data-color={props.color}>inner</span></span>
                </div>
            )
        })
        return (
            <>
                <h3>Template - External</h3>
                <Templated class="red" color="blue" />
                <Templated class="blue" color="red" />
            </>
        )
    }

    // Store the component for SSR testing
    registerTestObservable('TestTemplateExternal_ssr', ret)

    return ret
}

TestTemplateExternal.test = {
    static: true,
    expect: () => {
        const expected = '<div class="red"><span>outer <span data-color="blue">inner</span></span></div><div class="blue"><span>outer <span data-color="red">inner</span></span></div>'
        //<h3>Template - External</h3><div class="red"><span><span data-color="blue"></span></span></div><div class="blue"><span><span data-color="red"></span></span></div>, expected 
        //<h3>Template - External</h3><div class="red"><span>outer <span data-color="blue">inner</span></span></div><div class="blue"><span>outer <span data-color="red">inner</span></span></div>

        const ssrComponent = testObservables['TestTemplateExternal_ssr']
        const ssrResult = renderToString(ssrComponent)
        const expectedFull = '<h3>Template - External</h3><div class="red"><span>outer <span data-color="blue">inner</span></span></div><div class="blue"><span>outer <span data-color="red">inner</span></span></div>'
        if (ssrResult !== expectedFull) {
            assert(false, `[TestTemplateExternal] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ [TestTemplateExternal] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTemplateExternal} />

// console.log(renderToString(<TestTemplateExternal />))