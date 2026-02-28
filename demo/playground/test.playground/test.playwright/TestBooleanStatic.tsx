import { $, $$ } from 'woby'
import { TestSnapshots, } from './util'

const TestBooleanStatic = (): JSX.Element => {
    return (
        <>
            <h3>Boolean - Static</h3>
            <p>truefalse</p>
        </>
    )
}

TestBooleanStatic.test = {
    static: true,
    expect: () => '<p>truefalse</p>'
}


export default () => <TestSnapshots Component={TestBooleanStatic} />