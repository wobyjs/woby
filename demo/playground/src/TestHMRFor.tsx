import { $, $$, For, hmr, render, useTimeout, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const TestHMRFor = () => {
    const o = $([1, 2, 3])
    // Store the observable globally so the test can access it
    registerTestObservable('TestHMRFor', o)
    const update = () => o([2, 3, 4])
    useTimeout(update, TEST_INTERVAL)

    const Button = hmr(() => { }, ({ value, index }) => {
        return <button>{value}, {index}</button>
    })

    const ret: JSX.Element = () => (
        <>
            <h3>HMR - For</h3>
            <p>prev</p>
            <For values={o}>
                {(item, index) => (
                    <Button value={item} index={index} />
                )}
            </For>
            <p>next</p>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestHMRFor.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const values = $$(testObservables[name])
        const buttons = values.map((value, index) => `<button>${value}, ${index}</button>`).join('')

        // Define expected values for both main test and SSR test
        const expectedFull = `<h3>HMR - For</h3><p>prev</p>${buttons}<p>next</p>`
        const expected = `<p>prev</p>${buttons}<p>next</p>`

        const ssrComponent = testObservables[`${name}_ssr`]
        const ssrResult = renderToString(ssrComponent)
        if (ssrResult !== expectedFull) {
            assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${expectedFull}`)
        } else {
            console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
        }

        return expected
    }
}

const name = 'Test'
const Test = (): JSX.Element => {
    // Removed calls to undefined test functions that were causing errors
    return (
        <>
            <TestSnapshots Component={TestSimpleExpect} />
            <TestSnapshots Component={TestNullStatic} />
            <TestSnapshots Component={TestNullObservable} />
            <TestSnapshots Component={TestNumberStatic} />
            <TestSnapshots Component={TestNumberObservable} />
            <TestSnapshots Component={TestNumberFunction} />
            <TestSnapshots Component={TestNumberRemoval} />
            <TestSnapshots Component={TestBigIntStatic} />
            <TestSnapshots Component={TestBigIntObservable} />
            <TestSnapshots Component={TestBigIntFunction} />
            <TestSnapshots Component={TestBigIntRemoval} />
            <TestSnapshots Component={TestStringStatic} />
            <TestSnapshots Component={TestStringObservable} />
            <TestSnapshots Component={TestStringObservableStatic} />
            <TestSnapshots Component={TestStringObservableDeepStatic} />
            <TestSnapshots Component={TestStringFunction} />
            <TestSnapshots Component={TestStringRemoval} />
            <TestSnapshots Component={TestProgressIndeterminateToggle} />
            <TestSnapshots Component={TestDynamicObservableChildren} />
            <TestSnapshots Component={TestIfChildrenObservable} />
            <TestSnapshots Component={TestIfChildrenObservableStatic} />
            <TestSnapshots Component={TestIfChildrenFunction} />
            <TestSnapshots Component={TestIfChildrenFunctionObservable} />
            <TestSnapshots Component={TestIdStatic} />
            <TestSnapshots Component={TestIdObservable} />
            <TestSnapshots Component={TestIdFunction} />
            <TestSnapshots Component={TestIdRemoval} />
            <TestSnapshots Component={TestClassNameStatic} />
            <TestSnapshots Component={TestClassNameObservable} />
            <TestSnapshots Component={TestClassNameFunction} />
            <TestSnapshots Component={TestClassStatic} />
            <TestSnapshots Component={TestClassStaticString} />
            <TestSnapshots Component={TestClassObservable} />
            <TestSnapshots Component={TestClassObservableString} />
            <TestSnapshots Component={TestClassFunction} />
            <TestSnapshots Component={TestClassFunctionString} />
            <TestSnapshots Component={TestClassRemoval} />
            <TestSnapshots Component={TestClassRemovalString} />
            <TestSnapshots Component={TestStyleStatic} />
            <TestSnapshots Component={TestStyleStaticNumeric} />
            <TestSnapshots Component={TestStyleStaticString} />
            <TestSnapshots Component={TestStyleStaticVariable} />
            <TestSnapshots Component={TestStyleObservable} />
            <TestSnapshots Component={TestStyleObservableNumeric} />
            <TestSnapshots Component={TestStyleObservableString} />
            <TestSnapshots Component={TestStyleObservableVariable} />
            <TestSnapshots Component={TestStyleFunction} />
            <TestSnapshots Component={TestStyleFunctionNumeric} />
            <TestSnapshots Component={TestStyleFunctionString} />
            <TestSnapshots Component={TestStyleFunctionVariable} />
            <TestSnapshots Component={TestStyleRemoval} />
            <TestSnapshots Component={TestABCD} />
            <TestSnapshots Component={TestChildrenBoolean} />
            <TestSnapshots Component={TestChildrenSymbol} />
            <TestSnapshots Component={TestFragmentStatic} />
            <TestSnapshots Component={TestFragmentStaticComponent} />
            <TestSnapshots Component={TestFragmentStaticDeep} />
            <TestSnapshots Component={TestSVGStatic} />
            <TestSVGStaticComplex />
            <TestSnapshots Component={TestSVGStaticCamelCase} />
            <TestSnapshots Component={TestSVGObservable} />
            <TestSnapshots Component={TestSVGFunction} />
            <TestSnapshots Component={TestSVGStyleObject} />
            <TestSnapshots Component={TestSVGStyleString} />
            <TestSnapshots Component={TestSVGClassObject} />
            <TestSnapshots Component={TestSVGClassString} />
            <TestSnapshots Component={TestSVGAttributeRemoval} />
            <TestSnapshots Component={TestTemplateExternal} />
            <TestSnapshots Component={TestTemplateSVG} />
            <TestSnapshots Component={TestPortalStatic} />
            <TestSnapshots Component={TestPortalObservable} />
            <TestSnapshots Component={TestPortalRemoval} />
            <TestSnapshots Component={TestPortalMountObservable} />
            <TestSnapshots Component={TestPortalWhenObservable} />
            <TestSnapshots Component={TestPortalWrapperStatic} />
            <TestSnapshots Component={TestResourceFallbackValue} />
            <TestSnapshots Component={TestResourceFallbackLatest} />
            <TestSnapshots Component={TestSuspenseAlwaysValue} />
            <TestSnapshots Component={TestSuspenseAlwaysLatest} />
            <TestSnapshots Component={TestSuspenseNever} />
            <TestSnapshots Component={TestSuspenseNeverRead} />
            <TestSnapshots Component={TestSuspenseObservable} />
            <TestSnapshots Component={TestSuspenseWhen} />
            <TestSnapshots Component={TestSuspenseAlive} />
            <TestSnapshots Component={TestSuspenseChildrenObservableStatic} />
            <TestSnapshots Component={TestSuspenseChildrenFunction} />
            <TestSnapshots Component={TestSuspenseFallbackObservableStatic} />
            <TestSnapshots Component={TestSuspenseFallbackFunction} />
            <TestSnapshots Component={TestForUnkeyedRandom} />
            <TestSnapshots Component={TestLazy} />
            <TestSnapshots Component={TestNestedArrays} />
            <TestSnapshots Component={TestNestedIfs} />
            <TestSnapshots Component={TestNestedIfsLazy} />
            <TestSnapshots Component={TestContextDynamicContext} />
            <TestSnapshots Component={TestRefContext} />
            <hr />
        </>
    )
}

/* RENDER */

// Track if app has already been rendered to prevent multiple renders
let appRendered = false
let renderTimeout: number | null = null

// Wait for DOM to be ready before rendering
const renderApp = () => {
    // Clear any pending render
    if (renderTimeout !== null) {
        clearTimeout(renderTimeout)
        renderTimeout = null
    }

    if (appRendered) {
        console.log('App already rendered, skipping')
        return
    }

    const appElement = document.getElementById('app')

    if (appElement) {
        try {
            render(<Test />, appElement)
            appRendered = true
            console.log('App rendered successfully')
        } catch (error) {
            console.error('Failed to render app:', error)S
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                element: appElement,
                elementType: typeof appElement,
                elementConstructor: appElement?.constructor?.name
            })
        }
    } else {
        console.error('App element not found')
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp)
} else {
    // Small delay to ensure DOM is fully ready
    useTimeout(renderApp, 0)
}


export default () => <TestSnapshots Component={TestHMRFor} />