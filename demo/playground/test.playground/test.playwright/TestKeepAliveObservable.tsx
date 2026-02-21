import { $, $$, If, KeepAlive } from 'woby'
import { TestSnapshots } from './util'

const TestKeepAliveObservable = (): JSX.Element => {
    return (
        <>
            <h3>KeepAlive - Observable</h3>
            <If when={true}>
                <KeepAlive id="observable-1">
                    <p>0.123456</p>
                </KeepAlive>
            </If>
            <If when={true}>
                <KeepAlive id="observable-2" ttl={100}>
                    <p>0.789012</p>
                </KeepAlive>
            </If>
        </>
    )
}

TestKeepAliveObservable.test = {
    static: true,
    expect: () => '<p>0.123456</p><p>0.789012</p>'
}


export default () => <TestSnapshots Component={TestKeepAliveObservable} />