import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfChildrenObservable = (): JSX.Element => {
    const o = $(String(random()))
    registerTestObservable('TestIfChildrenObservable', o)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    return (
        <>
            <h3>If - Children Observable</h3>
            <If when={true}>{o}</If>
        </>
    )
}

TestIfChildrenObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => $$(testObservables['TestIfChildrenObservable'])
}


export default () => <TestSnapshots Component={TestIfChildrenObservable} />