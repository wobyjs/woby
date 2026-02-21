import { $, $$ } from 'woby'
import { TestSnapshots, random } from './util'

const TestPropertyValueFunction = (): JSX.Element => {
    // Static value for static test
    return (
        <>
            <h3>Property - Value Function</h3>
            <p><input value="0.123456" /></p>
        </>
    )
}

TestPropertyValueFunction.test = {
    static: true,
    expect: () => '<p><input></p>'
}

export default () => <TestSnapshots Component={TestPropertyValueFunction} />