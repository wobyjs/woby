import { $, $$, Portal } from 'woby'
import { TestSnapshots } from './util'

const TestPortalWhenObservable = (): JSX.Element => {
    // Static when for static test - set to true to show portal content
    const when = true
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
    static: true,
    expect: () => '<!---->' // Portal moves content to body, leaving empty here
}


export default () => <TestSnapshots Component={TestPortalWhenObservable} />