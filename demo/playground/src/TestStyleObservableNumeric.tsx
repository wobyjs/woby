import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleObservableNumeric = (): JSX.Element => {
    const o = $({ flexGrow: 1, width: 50 })
    registerTestObservable('TestStyleObservableNumeric', o)
    const toggle = () => o(prev => (prev.flexGrow === 1) ? { flexGrow: 2, width: 100 } : { flexGrow: 1, width: 50 })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Style - Observable Numeric</h3>
            <p style={o}>content</p>
        </>
    )
}

TestStyleObservableNumeric.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleObservableNumeric'])
        return `<p style="flex-grow: ${value.flexGrow}; width: ${value.width}px;">content</p>`
    }
}


export default () => <TestSnapshots Component={TestStyleObservableNumeric} />