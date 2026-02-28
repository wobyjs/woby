import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStylesFunction = (): JSX.Element => {
    const o = $({ color: 'orange', fontWeight: 'normal' })
    const toggle = () => o(prev => (prev.color === 'orange') ? { color: 'green', fontWeight: 'bold' } : { color: 'orange', fontWeight: 'normal' })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Styles - Function</h3>
            <p style={() => o()}>content</p>
        </>
    )
}

TestStylesFunction.test = {
    static: false,
    expect: () => '<p style="color: orange; font-weight: normal;">content</p>'
}


export default () => <TestSnapshots Component={TestStylesFunction} />