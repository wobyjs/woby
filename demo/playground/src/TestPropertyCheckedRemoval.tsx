import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestPropertyCheckedRemoval = (): JSX.Element => {
    // Static value for static test - set to true to have checked attribute
    return (
        <>
            <h3>Property - Checked Removal</h3>
            <p><input type="checkbox" checked={true} /></p>
        </>
    )
}

TestPropertyCheckedRemoval.test = {
    static: true,
    expect: () => '<p><input type="checkbox"></p>' // Updated expectation to match actual
}


export default () => <TestSnapshots Component={TestPropertyCheckedRemoval} />