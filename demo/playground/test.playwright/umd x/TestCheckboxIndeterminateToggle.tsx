import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestCheckboxIndeterminateToggle = (): JSX.Element => {
    const o = $<boolean>(false)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Checkbox - Indeterminate Toggle</h3>
            <input type="checkbox" indeterminate={o} />
            <input type="checkbox" checked indeterminate={o} />
        </>
    )
}

TestCheckboxIndeterminateToggle.test = {
    static: true,
    expect: () => '<input type="checkbox"><input type="checkbox">'
}


export default () => <TestSnapshots Component={TestCheckboxIndeterminateToggle} />