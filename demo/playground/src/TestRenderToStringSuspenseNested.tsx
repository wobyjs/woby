import { $, $$, Suspense, useResource, renderToString, type JSX } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert, useTimeout } from './util'

const TEST_INTERVAL = 500
let syncStep = 0
const syncValue = {}
const name = 'TestRenderToStringSuspenseNested'
const TestRenderToStringSuspenseNested = (): JSX.Element => {
    const o = $(123)
    const Content = ({ interval, title }) => {
        const resource = useResource(() => {
            return new Promise<number>(resolve => {
                setTimeout(() => {
                    registerTestObservable('TestRenderToStringSuspenseNested_o_' + title, o)

                    syncValue[++syncStep] = 123
                    resolve(o(123))
                }, interval)
            })
        })
        return <p>{o}{resource.value}</p>
    }

    //just to trigger the final output
    setTimeout(() => {
        syncValue[++syncStep] = 456
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


const name = 'TestRenderToStringSuspenseNestedSSR'
const TestRenderToStringSuspenseNestedSSR = (): JSX.Element => {
    const o = $(123)
    const Content = ({ interval, title }) => {
        o(o() + 1)
        return <p>{o}</p>
    }


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


// const ssr = testObservables[`${name}_ssr`]
let ssrResult = renderToString(<TestRenderToStringSuspenseNestedSSR />)
let expectedSSR = '<div><h3>renderToString - Suspense Nested</h3><p>124</p><p>125</p></div>' //final context
if (ssrResult !== expectedSSR /* && ssrResult !== '<div></div>' */) {
    assert(false, `${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedSSR}`)
} else {
    console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
}



TestRenderToStringSuspenseNested.test = {
    static: false,
    expect: () => {
        // console.assert(false, 'syncStep', syncStep)

        // SSR test move to module leval

        if (syncStep === 0) {
            return '<div><!----></div>'
        }// else if (syncStep === 1) {
        //     return `<div><p>${syncValue[syncStep]}${syncValue[syncStep]}</p><!----></div>`
        // }
        else {
            return [
                `<div><p>${syncValue[syncStep]}${syncValue[syncStep - 1]}</p><p>${syncValue[syncStep]}${syncValue[syncStep - 1]}</p></div>`,
                `<div><p>${syncValue[syncStep]}${syncValue[syncStep]}</p><p>${syncValue[syncStep]}${syncValue[syncStep]}</p></div>`,
                `<div><p>${syncValue[syncStep]}${syncValue[syncStep - 1]}</p><!----></div>`,
                `<div><p>${syncValue[syncStep]}${syncValue[syncStep]}</p><!----></div>`,
                `<div><p>${syncValue[syncStep]}${syncValue[syncStep]}</p></div>`,
            ]
        }
    }
}


export default () => <TestSnapshots Component={TestRenderToStringSuspenseNested} />

console.log(renderToString(<TestRenderToStringSuspenseNestedSSR />))

//<div><p>123123</p><p>123123</p></div>
//<div><p>123456</p><p>123456</p></div>
//<div><p>123456</p><!----></div>
//<div><p>123123</p><!----></div>
//<div><p>123123</p></div>