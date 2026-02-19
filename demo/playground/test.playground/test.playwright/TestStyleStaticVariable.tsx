import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleStaticVariable = (): JSX.Element => {
    return (
        <>
            <h3>Style - Static Variable</h3>
            <p style={{ color: 'var(--color)', '--color': 'green', '--foo': undefined, '--bar': null }}>content</p>
        </>
    )
}

TestStyleStaticVariable.test = {
    static: true,
    expect: () => '<p style="color: var(--color); --color: green;">content</p>'
}


export default () => <TestSnapshots Component={TestStyleStaticVariable} />