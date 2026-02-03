import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestTernaryObservableChildren = (): JSX.Element => {
    const AB = (): JSX.Element => {
        const a = <i>a</i>
        const b = <u>b</u>
        const component = $(a)
        const toggle = () => component(() => (component() === a) ? b : a)
        useInterval(toggle, TEST_INTERVAL / 2)
        return component
    }
    const CD = (): JSX.Element => {
        const c = <b>c</b>
        const d = <span>d</span>
        const component = $(c)
        const toggle = () => component(() => (component() === c) ? d : c)
        useInterval(toggle, TEST_INTERVAL / 2)
        return component
    }
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
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
    expect: () => '<i>a</i>'
}


export default () => <TestSnapshots Component={TestTernaryObservableChildren} />