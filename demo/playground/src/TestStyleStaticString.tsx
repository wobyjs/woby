import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleStaticString = (): JSX.Element => {
    return (
        <>
            <h3>Style - Static String</h3>
            <p style="flex-grow: 1; height: 50px;">content</p>
        </>
    )
}

TestStyleStaticString.test = {
    static: true,
    expect: () => '<p style="flex-grow: 1; height: 50px;">content</p>'
}


export default () => <TestSnapshots Component={TestStyleStaticString} />