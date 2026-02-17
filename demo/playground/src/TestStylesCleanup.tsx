import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStylesCleanup = (): JSX.Element => {
    const styles = { color: 'orange', fontWeight: 'bold' }  // Static value
    return (
        <>
            <h3>Styles - Observable Cleanup</h3>
            <p style={styles}>content</p>
        </>
    )
}

TestStylesCleanup.test = {
    static: true,
    expect: () => '<p style="color: orange; font-weight: bold;">content</p>'
}


export default () => <TestSnapshots Component={TestStylesCleanup} />