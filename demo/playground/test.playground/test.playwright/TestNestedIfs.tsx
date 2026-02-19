import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestNestedIfs = (): JSX.Element => {
    return (
        <>
            <If when={true}>
                <If when={true}>
                    <div>1</div>
                    <div>2</div>
                </If>
                <div>Footer</div>
            </If>
        </>
    )
}

TestNestedIfs.test = {
    static: true,
    expect: () => '<div>1</div><div>2</div><div>Footer</div>'
}


export default () => <TestSnapshots Component={TestNestedIfs} />