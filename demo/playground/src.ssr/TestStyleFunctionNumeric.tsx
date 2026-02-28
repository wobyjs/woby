import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleFunctionNumeric = (): JSX.Element => {
    const o = $({ flexGrow: 1, width: 50 })
    const toggle = () => o(prev => (prev.flexGrow === 1) ? { flexGrow: 2, width: 100 } : { flexGrow: 1, width: 50 })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Style - Function Numeric</h3>
            <p style={() => o()}>content</p>
        </>
    )
}

TestStyleFunctionNumeric.test = {
    static: false,
    expect: () => '<p style="flex-grow: {random-flex-grow}; width: {random-width}px;">content</p>'
}


export default () => <TestSnapshots Component={TestStyleFunctionNumeric} />