import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestAttributeObservableBoolean = (): JSX.Element => {
    const o = $(true)
    const toggle = () => o(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Attribute - Observable Boolean</h3>
            <p data-red={o}>content</p>
        </>
    )
}

TestAttributeObservableBoolean.test = {
    static: false,
    expect: () => '<p data-red="">content</p>'
}


export default () => <TestSnapshots Component={TestAttributeObservableBoolean} />