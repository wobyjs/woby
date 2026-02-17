import { $, $$, Portal, If } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPortalRemoval = (): JSX.Element => {
    const Inner = () => {
        return <p>content</p>
    }
    const Portalized = () => {
        return (
            <Portal mount={document.body}>
                <Inner />
            </Portal>
        )
    }
    const o = $<boolean | null>(true)
    const toggle = () => o(prev => prev ? null : true)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Portal - Removal</h3>
            <If when={o}>
                <Portalized />
            </If>
        </>
    )
}

TestPortalRemoval.test = {
    static: true,
    expect: () => '<!---->'
}


export default () => <TestSnapshots Component={TestPortalRemoval} />