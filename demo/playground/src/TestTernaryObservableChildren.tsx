import { $, $$, Ternary } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

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
        useInterval(toggle, TEST_INTERVAL)
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
        useInterval(toggle, TEST_INTERVAL)
        return component
    }
    const toggle = () => {
        const currentState = state()
        state({
            ...currentState,
            toggle: !currentState.toggle
        })
    }
    useInterval(toggle, TEST_INTERVAL * 2) // Use longer interval to reduce conflicts
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
        // if (testit) {
        const state = testObservables['TestTernaryObservableChildren_state']?.() ?? {
            toggle: true,
            abActive: true,
            cdActive: true
        }

        // Always return the current actual state based on observable values
        if (state.toggle) {
            // When toggle is true, AB component is rendered
            return state.abActive ? '<i>a</i>' : '<u>b</u>'
        } else {
            // When toggle is false, CD component is rendered
            return state.cdActive ? '<b>c</b>' : '<span>d</span>'
        }
        // }
        // else {
        //     testit = true
        // }
    }
}


export default () => <TestSnapshots Component={TestTernaryObservableChildren} />