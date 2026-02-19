import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSVGAttributeRemoval = (): JSX.Element => {
    const o = $<string | null>('red')
    // Store the observable globally so the test can access it
    registerTestObservable('TestSVGAttributeRemoval', o)
    const toggle = () => o(prev => (prev === 'red') ? null : 'red')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>SVG - Attribute Removal</h3>
            <svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" version={o} />
            </svg>
        </>
    )
}

TestSVGAttributeRemoval.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestSVGAttributeRemoval'])
        if (value) {
            return `<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20" version="${value}"></circle></svg>`
        } else {
            return '<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
        }
    }
}


export default () => <TestSnapshots Component={TestSVGAttributeRemoval} />