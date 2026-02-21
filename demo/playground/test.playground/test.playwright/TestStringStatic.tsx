import { $, $$ } from 'woby'
import { TestSnapshots, } from './util'

const TestStringStatic = (): JSX.Element => {
    return (
        <>
            <h3>String - Static</h3>
            <p>{'string'}</p>
        </>
    )
}

TestStringStatic.test = {
    static: true,
    expect: () => '<p>string</p>'
}


export default () => <TestSnapshots Component={TestStringStatic} />