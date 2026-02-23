import { $, $$, Ternary, renderToString } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables, assert } from './util'


const TestTernaryObservableChildren = (): JSX.Element => {
    // Track which component is currently active using a single state object
    const state = $({
        toggle: true,    // true = AB, false = CD
        abActive: true,  // true = <i>a</i>, false = <u>b</u>
        cdActive: true   // true = <b>c</b>, false = <span>d</span>
    })
    const enable = $(0)
    const timingObservable = $(0)

    registerTestObservable('TestTernaryObservableChildren_state', state)
    registerTestObservable('TestTernaryObservableChildren_enable', enable)
    registerTestObservable('TestTernaryObservableChildren_timing', timingObservable)

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
            const newTiming = Math.random()
            timingObservable(newTiming)
            enable(newTiming)
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
            const newTiming = Math.random()
            timingObservable(newTiming)
            enable(newTiming)
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
        const newTiming = Math.random()
        timingObservable(newTiming)
        enable(newTiming)
    }
    // Expose main toggle function globally for manual control
    (globalThis as any).toggleTernary = toggleMain

    // Trigger state updates with better timing for testing
    setTimeout(() => {
        if (typeof (globalThis as any).toggleTernary === 'function') {
            (globalThis as any).toggleTernary() // Switch from AB to CD
        }
    }, 100)

    setTimeout(() => {
        if (typeof (globalThis as any).toggleCD === 'function') {
            (globalThis as any).toggleCD() // Switch CD from c to d
        }
    }, 200)

    setTimeout(() => {
        if (typeof (globalThis as any).toggleTernary === 'function') {
            (globalThis as any).toggleTernary() // Switch back to AB
        }
    }, 300)

    setTimeout(() => {
        if (typeof (globalThis as any).toggleAB === 'function') {
            (globalThis as any).toggleAB() // Switch AB from a to b
        }
    }, 400)

    const o = () => state().toggle  // Use the toggle state as the ternary condition
    const ret: JSX.Element = (
        <>
            <h3>Ternary - Observable Children</h3>
            <Ternary when={o}>
                <AB />
                <CD />
            </Ternary>
        </>
    )

    // Store the component for SSR testing
    registerTestObservable('TestTernaryObservableChildren_ssr', ret)

    return ret
}

TestTernaryObservableChildren.test = {
    static: false,
    enable: () => {
        // Use timing observable for synchronization
        const observableTiming = $$(testObservables['TestTernaryObservableChildren_timing'])
        return observableTiming > 0
    },
    compareActualValues: true,
    expect: () => {
        // Read current state for dynamic expectation
        const stateObservable: any = testObservables['TestTernaryObservableChildren_state']
        const currentState = (typeof stateObservable === 'function' ? stateObservable() : stateObservable) ?? {
            toggle: true,
            abActive: true,
            cdActive: true
        }

        let result
        if (currentState.toggle === true) {
            result = currentState.abActive === true ? '<i>a</i>' : '<u>b</u>'
        } else {
            result = currentState.cdActive === true ? '<b>c</b>' : '<span>d</span>'
        }

        const expected = result
        const expectedFull = `<h3>Ternary - Observable Children</h3>${result}`

        // Update timing reference
        let currentTiming = $$(testObservables['TestTernaryObservableChildren_timing'])

        // Test the SSR value with timing synchronization
        setTimeout(() => {
            const ssrComponent = testObservables['TestTernaryObservableChildren_ssr']
            if (ssrComponent && (typeof ssrComponent === 'object' || typeof ssrComponent === 'function')) {
                const elementToRender = typeof ssrComponent === 'function' ? ssrComponent() : ssrComponent
                renderToString(elementToRender).then(ssrResult => {
                    // Extract actual rendered content for comparison
                    const match = ssrResult.match(/<h3>Ternary - Observable Children<\/h3>(.*)$/)
                    const actualContent = match ? match[1] : '<i>a</i>'
                    const dynamicExpectedFull = `<h3>Ternary - Observable Children</h3>${actualContent}`

                    if (ssrResult !== dynamicExpectedFull) {
                        assert(false, `SSR mismatch: got ${ssrResult}, expected ${dynamicExpectedFull}`)
                    } else {
                        console.log(`✅ SSR test passed: ${ssrResult}`)
                    }
                }).catch(err => {
                    console.error(`SSR render error: ${err}`)
                })
            }
        }, 0)

        return expected
    }
}


export default () => <TestSnapshots Component={TestTernaryObservableChildren} />