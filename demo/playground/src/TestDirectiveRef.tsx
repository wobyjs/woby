import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDirectiveRef = (): JSX.Element => {
    const model = (element, arg1) => {
        useEffect(() => {
            const value = `${arg1}`
            element.value = value
            element.setAttribute('value', value)
        }, { sync: true })
    }
    const Model = createDirective('model', model)
    return (
        <>
            <h3>Directive - Ref</h3>
            <input ref={Model.ref('bar')} value="foo" />
        </>
    )
}

TestDirectiveRef.test = {
    static: true,
    expect: () => '<input value="bar">'
}


export default () => <TestSnapshots Component={TestDirectiveRef} />