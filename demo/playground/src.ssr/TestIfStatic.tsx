import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfStatic = (): JSX.Element => {
    return (
        <>
            <h3>If - Static</h3>
            <If when={true}>
                <p>true</p>
            </If>
            <If when={false}>
                <p>false</p>
            </If>
        </>
    )
}

TestIfStatic.test = {
    static: true,
    expect: () => '<p>true</p>'
}


export default () => <TestSnapshots Component={TestIfStatic} />