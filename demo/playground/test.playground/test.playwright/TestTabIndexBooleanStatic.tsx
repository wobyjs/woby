import { $, $$ } from 'woby'
import { TestSnapshots, } from './util'

const TestTabIndexBooleanStatic = (): JSX.Element => {
    return (
        <>
            <h3>TabIndex - Boolean - Static</h3>
            <p tabIndex={true}>true</p>
            <p tabIndex={false}>false</p>
        </>
    )
}

TestTabIndexBooleanStatic.test = {
    static: true,
    expect: () => '<p tabindex="0">true</p><p>false</p>'
}


export default () => <TestSnapshots Component={TestTabIndexBooleanStatic} />