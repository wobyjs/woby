import { $, $$ } from 'woby'
import { If } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfChildrenFunctionObservable = (): JSX.Element => {
    const o = $<number | false>(Math.random())
    registerTestObservable('TestIfChildrenFunctionObservable', o)
    const toggle = () => o(prev => prev ? false : Math.random())
    useInterval(toggle, TEST_INTERVAL)
    const Content = ({ value }): JSX.Element => {
        return <p>Value: {value}</p>
    }
    return (
        <>
            <h3>If - Children Function Observable</h3>
            <If when={o}>
                {value => <Content value={value} />}
            </If>
        </>
    )
}

TestIfChildrenFunctionObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables['TestIfChildrenFunctionObservable'])
        return val !== false ? `<p>Value: ${val}</p>` : '<!---->'
    }
}


export default () => <TestSnapshots Component={TestIfChildrenFunctionObservable} />