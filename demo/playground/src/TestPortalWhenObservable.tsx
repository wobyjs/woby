import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPortalWhenObservable = (): JSX.Element => {
    const when = $(false)
    const toggle = () => when(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Portal - When Observable</h3>
            <Portal mount={document.body} when={when}>
                <p>content</p>
            </Portal>
        </>
    )
}

TestPortalWhenObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => '<!---->'
}


export default () => <TestSnapshots Component={TestPortalWhenObservable} />