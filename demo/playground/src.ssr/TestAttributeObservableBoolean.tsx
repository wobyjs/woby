import { $, $$ } from 'woby'
import { TestSnapshots, registerTestObservable, testObservables } from './util'

const TestAttributeObservableBoolean = (): JSX.Element => {
    const o = $(false)
    registerTestObservable('TestAttributeObservableBoolean', o)
    return (
        <>
            <h3>Attribute - Observable Boolean</h3>
            <p data-red={o}>content</p>
        </>
    )
}

TestAttributeObservableBoolean.test = {
    static: true, // Make it static for predictable testing
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestAttributeObservableBoolean'])
        if (value) {
            return '<p data-red="true">content</p>'
        } else {
            return '<p data-red="false">content</p>'
        }
    }
}


export default () => <TestSnapshots Component={TestAttributeObservableBoolean} />