import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestAttributeObservable = (): JSX.Element => {
    const o = $('red')
    const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Attribute - Observable</h3>
            <p data-color={o}>content</p>
        </>
    )
}

TestAttributeObservable.test = {
    static: false,
    expect: () => '<p data-color="red">content</p>'
}


export default () => <TestSnapshots Component={TestAttributeObservable} />