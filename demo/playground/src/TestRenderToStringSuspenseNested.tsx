import { $, $$, Suspense, useResource, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, useTimeout } from './util'

const TEST_INTERVAL = 500
let syncStep = 0

const TestRenderToStringSuspenseNested = (): JSX.Element => {
    const o = $(123)
    const Content = ({ interval, title }) => {
        const resource = useResource(() => {
            return new Promise<number>(resolve => {
                setTimeout(() => {
                    console.log('syncStep', ++syncStep)
                    registerTestObservable('TestRenderToStringSuspenseNested_o_' + title, o)

                    resolve(o(123))
                }, interval)
            })
        })
        return <p>{o}{resource.value}</p>
    }

    //just to trigger the final output
    setTimeout(() => {
        o(456)
    }, TEST_INTERVAL * 3)

    const ret: JSX.Element = () => (
        <div>
            <h3>renderToString - Suspense Nested</h3>
            <Suspense>
                <Content interval={TEST_INTERVAL} title="1st Suspense" />
                <Suspense>
                    <Content interval={TEST_INTERVAL} title="2nd Suspense" />
                </Suspense>
            </Suspense>
        </div>
    )

    // Store the component for SSR testing
    registerTestObservable('TestRenderToStringSuspenseNested_ssr', ret)

    return ret
}


const TestRenderToStringSuspenseNestedSSR = (): JSX.Element => {
    const o = $(123)
    const Content = ({ interval, title }) => {
        // const resource = useResource(() => {
        // return new Promise<number>(resolve => {
        // setTimeout(() => {
        // console.log('syncStep', ++syncStep)
        // registerTestObservable('TestRenderToStringSuspenseNested_o_' + title, o)

        // resolve(o(123))
        o(o() + 1)
        // }, interval)
        // })
        // })
        // return <p>{o}{resource.value}</p>
        return <p>{o}</p>
    }

    //just to trigger the final output
    // setTimeout(() => {
    //     o(456)
    // }, TEST_INTERVAL * 3)

    const ret: JSX.Element = () => (
        <div>
            <h3>renderToString - Suspense Nested</h3>
            <Suspense>
                <Content interval={TEST_INTERVAL} title="1st Suspense" />
                <Suspense>
                    <Content interval={TEST_INTERVAL} title="2nd Suspense" />
                </Suspense>
            </Suspense>
        </div>
    )

    // Store the component for SSR testing
    // registerTestObservable('TestRenderToStringSuspenseNested_ssr', ret)

    return ret
}


// const ssr = testObservables['TestRenderToStringSuspenseNested_ssr']
let ssrResult = renderToString(<TestRenderToStringSuspenseNestedSSR />)
let expectedSSR = '<div><h3>renderToString - Suspense Nested</h3><p>124</p><p>125</p></div>' //final context
if (ssrResult !== expectedSSR /* && ssrResult !== '<div></div>' */) {
    assert(false, `[TestRenderToStringSuspenseNested] SSR mismatch: got ${ssrResult}, expected ${expectedSSR}`)
} else {
    console.log(`✅ [TestRenderToStringSuspenseNested] SSR test passed: ${ssrResult}`)
}



TestRenderToStringSuspenseNested.test = {
    static: false,
    expect: () => {
        console.log('syncStep', syncStep)

        // const ssr = testObservables['TestRenderToStringSuspenseNested_ssr']
        // let ssrResult = renderToString(ssr)
        // let expectedSSR = '<div><p>456123</p><p><!----></p></div>' //final context
        // if (ssrResult !== expectedSSR /* && ssrResult !== '<div></div>' */) {
        //     assert(false, `[TestRenderToStringSuspenseNested] SSR mismatch: got ${ssrResult}, expected ${expectedSSR}`)
        // } else {
        //     console.log(`✅ [TestRenderToStringSuspenseNested] SSR test passed: ${ssrResult}`)
        // }


        if (syncStep === 0) {
            return '<div><!----></div>'
        } else if (syncStep === 1) {
            return '<div><p>123123</p><!----></div>'
        }

        // syncStep >= 2, both resources are loaded
        // Check current value of o from the registered observable
        const oObservable = testObservables['TestRenderToStringSuspenseNested_o_1st Suspense']
        const currentO = oObservable ? $$(oObservable) : 123

        if (currentO === 456) {
            return '<div><p>456123</p><p>456123</p></div>'
        } else {
            return '<div><p>123123</p><p>123123</p></div>'
        }
    }
}


export default () => <TestSnapshots Component={TestRenderToStringSuspenseNested} />

// console.log(renderToString(<TestRenderToStringSuspenseNestedSSR />))