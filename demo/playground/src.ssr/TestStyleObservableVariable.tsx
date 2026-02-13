import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleObservableVariable = (): JSX.Element => {
    const o = $('green')
    const toggle = () => o(prev => (prev === 'orange') ? 'green' : 'orange')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Style - Observable Variable</h3>
            <p style={{ color: 'var(--color)', '--color': o }}>content</p>
        </>
    )
}

TestStyleObservableVariable.test = {
    static: false,
    expect: () => '<p style="color: var(--color); --color: {random-color};">content</p>'
}


export default () => <TestSnapshots Component={TestStyleObservableVariable} />