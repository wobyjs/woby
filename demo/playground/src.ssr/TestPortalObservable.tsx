import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPortalObservable = (): JSX.Element => {
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
    const ab = <AB />
    const cd = <CD />
    const component = $(ab)
    const toggle = () => component(() => (component() === ab) ? cd : ab)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Portal - Observable</h3>
            <Portal mount={document.body}>
                {component}
            </Portal>
        </>
    )
}

TestPortalObservable.test = {
    static: true,
    expect: () => '<!---->'
}


export default () => <TestSnapshots Component={TestPortalObservable} />