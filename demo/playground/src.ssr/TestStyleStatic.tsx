import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleStatic = (): JSX.Element => {
    return (
        <>
            <h3>Style - Static</h3>
            <p style={{ color: 'green' }}>content</p>
        </>
    )
}

TestStyleStatic.test = {
    static: true,
    expect: () => '<p style="color: green;">content</p>'
}


export default () => <TestSnapshots Component={TestStyleStatic} />