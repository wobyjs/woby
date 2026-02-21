import { $, $$ } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables } from './util'

const TestIdRemoval = (): JSX.Element => {
    const o = $<string | null>(null)  // Start with null to test removal
    registerTestObservable('TestIdRemoval', o)
    return (
        <>
            <h3>ID - Removal</h3>
            <p id={o}>content</p>
        </>
    )
}

TestIdRemoval.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestIdRemoval'])
        return value ? `<p id="${value}">content</p>` : '<p>content</p>'
    }
}


export default () => <TestSnapshots Component={TestIdRemoval} />