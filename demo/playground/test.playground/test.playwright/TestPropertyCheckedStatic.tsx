import { $, $$ } from 'woby'
import { TestSnapshots } from './util'

const TestPropertyCheckedStatic = (): JSX.Element => {
    return (
        <>
            <h3>Property - Checked Static</h3>
            <p><input type="checkbox" checked={true} /></p>
        </>
    )
}

TestPropertyCheckedStatic.test = {
    static: true,
    expect: () => '<p><input type="checkbox"></p>'
}

export default () => <TestSnapshots Component={TestPropertyCheckedStatic} />