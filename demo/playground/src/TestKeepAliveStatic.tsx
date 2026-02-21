import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestKeepAliveStatic = (): JSX.Element => {
    return (
        <>
            <h3>KeepAlive - Static</h3>
            <KeepAlive id="static">
                <p>123</p>
            </KeepAlive>
        </>
    )
}

TestKeepAliveStatic.test = {
    static: true,
    expect: () => '<p>123</p>'
}


export default () => <TestSnapshots Component={TestKeepAliveStatic} />