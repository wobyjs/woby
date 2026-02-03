import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestKeepAliveObservable = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)

    return (
        <>
            <h3>KeepAlive - Observable</h3>
            <If when={o}>
                <KeepAlive id="observable-1">
                    <p>{() => {
                        const val = Math.random()
                        registerTestObservable('TestKeepAliveObservable_1', val)
                        return val
                    }}</p>
                </KeepAlive>
            </If>
            <If when={o}>
                <KeepAlive id="observable-2" ttl={100}>
                    <p>{() => {
                        const val = Math.random()
                        registerTestObservable('TestKeepAliveObservable_2', val)
                        return val
                    }}</p>
                </KeepAlive>
            </If>
        </>
    )
}

TestKeepAliveObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val1 = testObservables['TestKeepAliveObservable_1']
        const val2 = testObservables['TestKeepAliveObservable_2']
        return `<p>${val1}</p><p>${val2}</p>`
    }
}


export default () => <TestSnapshots Component={TestKeepAliveObservable} />