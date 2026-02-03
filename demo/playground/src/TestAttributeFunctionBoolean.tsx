import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestAttributeFunctionBoolean = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Attribute - Function Boolean</h3>
            <p data-red={() => !o()}>content</p>
        </>
    )
}

TestAttributeFunctionBoolean.test = {
    static: false,
    expect: () => '<p data-red="false">content</p>'
}


export default () => <TestSnapshots Component={TestAttributeFunctionBoolean} />