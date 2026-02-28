import { $, $$ } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables } from './util'

const TestAttributeFunctionBoolean = (): JSX.Element => {
    const o = $(true)
    registerTestObservable('TestAttributeFunctionBoolean', o)
    return (
        <>
            <h3>Attribute - Function Boolean</h3>
            <p data-red={() => !o()}>content</p>
        </>
    )
}

TestAttributeFunctionBoolean.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestAttributeFunctionBoolean'])
        // Since the attribute uses !o(), when o() is true, the attr value is false
        const attrValue = !value
        if (attrValue) {
            return '<p data-red="true">content</p>'
        } else {
            return '<p data-red="false">content</p>'
        }
    }
}


export default () => <TestSnapshots Component={TestAttributeFunctionBoolean} />