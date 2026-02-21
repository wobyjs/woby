import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestAttributeFunction = (): JSX.Element => {
    const o = $('red')
    // Store the observable globally so the test can access it
    registerTestObservable('TestAttributeFunction', o)
    const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Attribute - Function</h3>
            <p data-color={() => `dark${o()}`}>content</p>
        </>
    )
}

TestAttributeFunction.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestAttributeFunction'])
        return `<p data-color="dark${value}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestAttributeFunction} />