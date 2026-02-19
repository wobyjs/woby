import { $, $$ } from 'woby'
import { TestSnapshots, random } from './util'

const TestPropertyValueObservable = (): JSX.Element => {
    // Static value for static test
    return (
        <>
            <h3>Property - Value Observable</h3>
            <p><input value="0.123456" /></p>
        </>
    )
}

TestPropertyValueObservable.test = {
    static: true,
    expect: () => '<p><input></p>'
}

export default () => <TestSnapshots Component={TestPropertyValueObservable} />