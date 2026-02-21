import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestPortalWrapperStatic = (): JSX.Element => {
    return (
        <>
            <h3>Portal - Wrapper Static</h3>
            <Portal mount={document.body} wrapper={<div class="custom-wrapper" />}>
                <p>content</p>
            </Portal>
        </>
    )
}

TestPortalWrapperStatic.test = {
    static: true,
    expect: () => '<!---->'
}


export default () => <TestSnapshots Component={TestPortalWrapperStatic} />