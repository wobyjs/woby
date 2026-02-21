import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestPropertyValueRemoval = (): JSX.Element => {
    // Static value for static test - set to a defined value
    return (
        <>
            <h3>Property - Value Removal</h3>
            <p><input value="test-value" /></p>
        </>
    )
}

TestPropertyValueRemoval.test = {
    static: true,
    expect: () => '<p><input></p>'
}


export default () => <TestSnapshots Component={TestPropertyValueRemoval} />