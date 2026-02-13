import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDirectiveSingleArgument = (): JSX.Element => {
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
            <h3>Directive - Single Argument</h3>
            <Model.Provider>
                <input value="foo" use:model="bar" />
            </Model.Provider>
        </>
    )
}

TestDirectiveSingleArgument.test = {
    static: true,
    expect: () => '<input value="bar">'
}


export default () => <TestSnapshots Component={TestDirectiveSingleArgument} />