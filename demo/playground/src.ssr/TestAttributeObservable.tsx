import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestAttributeObservable = (): JSX.Element => {
    const o = $('red')
    // Store the observable globally so the test can access it
    registerTestObservable('TestAttributeObservable', o)
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
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestAttributeObservable'])
        return `<p data-color="${value}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestAttributeObservable} />