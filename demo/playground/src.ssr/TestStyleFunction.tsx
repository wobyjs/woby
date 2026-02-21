import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleFunction = (): JSX.Element => {
    const o = $('green')
    const toggle = () => o(prev => (prev === 'green') ? 'orange' : 'green')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Style - Function</h3>
            <p style={{ color: () => o() }}>content</p>
        </>
    )
}

TestStyleFunction.test = {
    static: false,
    expect: () => '<p style="color: {random-color};">content</p>'
}


export default () => <TestSnapshots Component={TestStyleFunction} />