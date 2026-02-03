import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestAttributeRemoval = (): JSX.Element => {
    const o = $<string | null>('red')
    // Store the observable globally so the test can access it
    registerTestObservable('TestAttributeRemoval', o)
    const toggle = () => o(prev => (prev === 'red') ? null : 'red')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Attribute - Removal</h3>
            <p data-color={o}>content</p>
        </>
    )
}

TestAttributeRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestAttributeRemoval'])
        return value ? `<p data-color="${value}">content</p>` : '<p data-color="">content</p>'
    }
}


export default () => <TestSnapshots Component={TestAttributeRemoval} />