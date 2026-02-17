import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStylesObservable = (): JSX.Element => {
    const styles = { color: 'orange', fontWeight: 'normal' }  // Static value
    return (
        <>
            <h3>Styles - Observable</h3>
            <p style={styles}>content</p>
        </>
    )
}

TestStylesObservable.test = {
    static: true,
    expect: () => '<p style="color: orange; font-weight: normal;">content</p>'
}


export default () => <TestSnapshots Component={TestStylesObservable} />