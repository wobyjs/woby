import { $, $$ } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables } from './util'

const TestAttributeRemoval = (): JSX.Element => {
    const o = $<string | null>(null)  // Start with null to test removal
    registerTestObservable('TestAttributeRemoval', o)
    return (
        <>
            <h3>Attribute - Removal</h3>
            <p data-color={o}>content</p>
        </>
    )
}

TestAttributeRemoval.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestAttributeRemoval'])
        return value ? `<p data-color="${value}">content</p>` : '<p>content</p>'
    }
}


export default () => <TestSnapshots Component={TestAttributeRemoval} />