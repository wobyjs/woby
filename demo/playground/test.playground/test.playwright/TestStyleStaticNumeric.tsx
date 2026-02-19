import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleStaticNumeric = (): JSX.Element => {
    return (
        <>
            <h3>Style - Static Numeric</h3>
            <p style={{ flexGrow: 1, height: 50 }}>content</p>
        </>
    )
}

TestStyleStaticNumeric.test = {
    static: true,
    expect: () => '<p style="flex-grow: 1; height: 50px;">content</p>'
}


export default () => <TestSnapshots Component={TestStyleStaticNumeric} />