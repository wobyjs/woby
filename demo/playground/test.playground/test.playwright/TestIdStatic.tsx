import { $, $$ } from 'woby'
import { TestSnapshots, } from './util'

const TestIdStatic = (): JSX.Element => {
    return (
        <>
            <h3>ID - Static</h3>
            <p id="foo">content</p>
        </>
    )
}

TestIdStatic.test = {
    static: true,
    expect: () => '<p id="foo">content</p>'
}


export default () => <TestSnapshots Component={TestIdStatic} />