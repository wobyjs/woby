import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestPropertyCheckedObservable = (): JSX.Element => {
    // Static value for static test
    return (
        <>
            <h3>Property - Checked Observable</h3>
            <p><input type="checkbox" checked={true} /></p>
        </>
    )
}

TestPropertyCheckedObservable.test = {
    static: true,
    expect: () => '<p><input type="checkbox"></p>'
}

export default () => <TestSnapshots Component={TestPropertyCheckedObservable} />