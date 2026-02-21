import { $, $$ } from 'woby'
import { TestSnapshots, } from './util'

const TestAttributeBooleanStatic = (): JSX.Element => {
    return (
        <>
            <h3>Attribute Boolan - Static</h3>
            <p disabled={true}>content</p>
            <p disabled={false}>content</p>
        </>
    )
}

TestAttributeBooleanStatic.test = {
    static: true,
    expect: () => '<p disabled="">content</p><p>content</p>'
}


export default () => <TestSnapshots Component={TestAttributeBooleanStatic} />