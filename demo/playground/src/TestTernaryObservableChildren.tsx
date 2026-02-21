import { $, $$, Ternary } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables } from './util'

// let testit = true

const TestTernaryObservableChildren = (): JSX.Element => {
    // Track which component is currently active using a single state object
    const state = $({
        toggle: true,    // true = AB, false = CD
        abActive: true,  // true = <i>a</i>, false = <u>b</u>
        cdActive: true   // true = <b>c</b>, false = <span>d</span>
    })

    registerTestObservable('TestTernaryObservableChildren_state', state)

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
            // testit = false
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
            // testit = false
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
    }
    // Expose main toggle function globally for manual control
    (globalThis as any).toggleTernary = toggleMain
    
    // Trigger initial state update to ensure test runs
    setTimeout(() => {
        if (typeof (globalThis as any).toggleAB === 'function') {
            (globalThis as any).toggleAB();
        }
    }, 100);
    
    const o = () => state().toggle  // Use the toggle state as the ternary condition
    return (
        <>
            <h3>Ternary - Observable Children</h3>
            <Ternary when={o}>
                <AB />
                <CD />
            </Ternary>
        </>
    )
}

TestTernaryObservableChildren.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const state = testObservables['TestTernaryObservableChildren_state']?.() ?? {
            toggle: true,
            abActive: true,
            cdActive: true
        }

        // Robust state checking with fallbacks
        try {
            if (state.toggle === true) {
                // AB component is active
                return state.abActive === true ? '<i>a</i>' : '<u>b</u>'
            } else if (state.toggle === false) {
                // CD component is active
                return state.cdActive === true ? '<b>c</b>' : '<span>d</span>'
            } else {
                // Fallback to default state
                return '<i>a</i>'
            }
        } catch (error) {
            // Return safe fallback on any error
            return '<i>a</i>'
        }
    }
}


export default () => <TestSnapshots Component={TestTernaryObservableChildren} />