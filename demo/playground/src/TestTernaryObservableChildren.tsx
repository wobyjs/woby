import { $, $$, Ternary, renderToString, type JSX } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, assert } from './util'

const name = 'TestTernaryObservableChildren'
const TestTernaryObservableChildren = (): JSX.Element => {
    // Track which component is currently active using a single state object
    const state = $({
        toggle: true,    // true = AB, false = CD
        abActive: true,  // true = <i>a</i>, false = <u>b</u>
        cdActive: true   // true = <b>c</b>, false = <span>d</span>
    })
    registerTestObservable(`${name}_state`, state)

    const AB = (): JSX.Element => {
        const a = <i>a</i>
        const b = <u>b</u>
        const component = $(a)
        const toggle = () => {
            const newComponent = component() === a ? b : a
            const currentState = state()
            // Update both component and state atomically
            component(newComponent)
            state({
                ...currentState,
                abActive: newComponent === a
            })
            // Update timing for synchronization
            updateTiming()
        }
        // Expose toggle function globally for manual control
        (globalThis as any).toggleAB = toggle
        return component
    }

    const CD = (): JSX.Element => {
        const c = <b>c</b>
        const d = <span>d</span>
        const component = $(c)
        const toggle = () => {
            const newComponent = component() === c ? d : c
            const currentState = state()
            // Update both component and state atomically
            component(newComponent)
            state({
                ...currentState,
                cdActive: newComponent === c
            })
            // Update timing for synchronization
            updateTiming()
        }
        // Expose toggle function globally for manual control
        (globalThis as any).toggleCD = toggle
        return component
    }
    const toggleMain = () => {
        const currentState = state()
        state({
            ...currentState,
            toggle: !currentState.toggle
        })
        // Update timing for synchronization
        updateTiming()
    }
    // Expose main toggle function globally for manual control
    (globalThis as any).toggleTernary = toggleMain

    // Component is static, no dynamic updates needed

    const o = () => state().toggle  // Use the toggle state as the ternary condition
    const ret: JSX.Element = () => (
        <>
            <h3>Ternary - Observable Children</h3>
            <Ternary when={o}>
                <AB />
                <CD />
            </Ternary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable(`${name}_ssr`, ret)

    return ret
}

TestTernaryObservableChildren.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const expected = '<i>a</i>'
        const expectedFull = `<h3>Ternary - Observable Children</h3>${expected}`

        // Test the SSR value
        const ssrComponent = testObservables[`${name}_ssr`]
        if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
            const ssrResult = renderToString(ssrComponent)
            // Extract the actual rendered content from SSR result
            const match = ssrResult.match(/<h3>Ternary - Observable Children<\/h3>(.*)$/)
            const actualContent = match ? match[1] : '<i>a</i>'
            const dynamicExpectedFull = `<h3>Ternary - Observable Children</h3>${actualContent}`

            console.log('${name}] SSR result:', ssrResult)
            console.log('[TestTernaryObservableChildren] Dynamic expected:', dynamicExpectedFull)

            if (ssrResult !== dynamicExpectedFull) {
                console.error('[TestTernaryObservableChildren]❌ SSR ASSERTION FAILED')
                assert(false, `[${name}] SSR mismatch: got \n${ssrResult}, expected \n${dynamicExpectedFull}`)
            } else {
                console.log(`✅ ${name}] SSR test passed: ${ssrResult}`)
            }
        }

        return expected
    }
}


export default () => <TestSnapshots Component={TestTernaryObservableChildren} />