import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleObservable = (): JSX.Element => {
    const o = $('green')
    const toggle = () => o(prev => (prev === 'green') ? 'orange' : 'green')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Style - Observable</h3>
            <p style={{ color: o }}>content</p>
        </>
    )
}

TestStyleObservable.test = {
    static: false,
    expect: () => '<p style="color: {random-color};">content</p>'
}


export default () => <TestSnapshots Component={TestStyleObservable} />