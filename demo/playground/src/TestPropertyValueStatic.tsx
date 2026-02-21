import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestPropertyValueStatic = (): JSX.Element => {
    return (
        <>
            <h3>Property - Value Static</h3>
            <p><input value="value" /></p>
        </>
    )
}

TestPropertyValueStatic.test = {
    static: true,
    expect: () => '<p><input></p>'
}

export default () => <TestSnapshots Component={TestPropertyValueStatic} />