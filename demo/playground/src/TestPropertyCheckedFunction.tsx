import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestPropertyCheckedFunction = (): JSX.Element => {
    // Static value for static test
    return (
        <>
            <h3>Property - Checked Function</h3>
            <p><input type="checkbox" checked={true} /></p>
        </>
    )
}

TestPropertyCheckedFunction.test = {
    static: true,
    expect: () => '<p><input type="checkbox"></p>'
}

export default () => <TestSnapshots Component={TestPropertyCheckedFunction} />