import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleFunctionString = (): JSX.Element => {
    const o = $('color: green')
    const toggle = () => o(prev => (prev === 'color: green') ? 'color: orange' : 'color: green')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Style - Function String</h3>
            <p style={() => o()}>content</p>
        </>
    )
}

TestStyleFunctionString.test = {
    static: false,
    expect: () => '<p style="color: {random-class}">content</p>'
}


export default () => <TestSnapshots Component={TestStyleFunctionString} />