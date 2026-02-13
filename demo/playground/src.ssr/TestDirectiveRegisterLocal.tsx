import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDirectiveRegisterLocal = (): JSX.Element => {
    const model = (element, arg1, arg2) => {
        useEffect(() => {
            const value = `${arg1} - ${arg2}`
            element.value = value
            element.setAttribute('value', value)
        }, { sync: true })
    }
    const Model = createDirective('modelLocal', model)
    Model.register()
    return (
        <>
            <h3>Directive</h3>
            <input value="foo" use:modelLocal={['bar', 'baz']} />
        </>
    )
}

TestDirectiveRegisterLocal.test = {
    static: true,
    expect: () => '<input value="bar - baz">'
}


export default () => <TestSnapshots Component={TestDirectiveRegisterLocal} />