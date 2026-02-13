import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPortalRemoval = (): JSX.Element => {
    const Inner = () => {
        const log = () => console.count('portal.inner')
        useInterval(log, TEST_INTERVAL / 4)
        return <p>content</p>
    }
    const Portalized = () => {
        const log = () => console.count('portal')
        useInterval(log, TEST_INTERVAL / 4)
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