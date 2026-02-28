import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStylesStatic = (): JSX.Element => {
    return (
        <>
            <h3>Styles - Static</h3>
            <p style={{ color: 'green' }}>content</p>
        </>
    )
}

TestStylesStatic.test = {
    static: true,
    expect: () => '<p style="color: green;">content</p>'
}


export default () => <TestSnapshots Component={TestStylesStatic} />