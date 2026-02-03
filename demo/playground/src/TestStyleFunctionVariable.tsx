import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleFunctionVariable = (): JSX.Element => {
    const o = $('green')
    const toggle = () => o(prev => (prev === 'orange') ? 'green' : 'orange')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Style - Function Variable</h3>
            <p style={{ color: 'var(--color)', '--color': () => o() }}>content</p>
        </>
    )
}

TestStyleFunctionVariable.test = {
    static: false,
    expect: () => '<p style="color: var(--color); --color: {random-color};">content</p>'
}


export default () => <TestSnapshots Component={TestStyleFunctionVariable} />