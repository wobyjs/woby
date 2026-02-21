import { $, $$, Portal } from 'woby'
import { TestSnapshots, } from './util'
const TestPortalStatic = (): JSX.Element => {
    return (
        <>
            <h3>Portal - Static</h3>
            <Portal mount={document.body}>
                <p>content</p>
            </Portal>
        </>
    )
}

TestPortalStatic.test = {
    static: true,
    expect: () => '<!---->'
}


export default () => <TestSnapshots Component={TestPortalStatic} />