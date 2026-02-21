import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestNestedIfsLazy = (): JSX.Element => {
    const o = $(false)
    // Store the observable globally so the test can access it
    registerTestObservable('TestNestedIfsLazy', o)
    const toggle = () => o(prev => !prev)
    useTimeout(toggle, TEST_INTERVAL)
    return (
        <>
            <div>before</div>
            <If when={o}>
                <If when={true}>
                    <div>inner</div>
                </If>
            </If>
            <div>after</div>
        </>
    )
}

TestNestedIfsLazy.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const isInnerVisible = $$(testObservables['TestNestedIfsLazy'])
        return isInnerVisible
            ? '<div>before</div><div>inner</div><div>after</div>'
            : '<div>before</div><!----><div>after</div>'
    }
}


export default () => <TestSnapshots Component={TestNestedIfsLazy} />