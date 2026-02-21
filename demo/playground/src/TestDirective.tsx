import { $, $$, createDirective, useEffect } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDirective = (): JSX.Element => {
    const model = (element, arg1, arg2) => {
        useEffect(() => {
            const value = `${arg1} - ${arg2}`
            element.value = value
            element.setAttribute('value', value)
        }, { sync: true })
    }
    const Model = createDirective('model', model)
    return (
        <>
            <h3>Directive</h3>
            <Model.Provider>
                <input value="foo" use:model={['bar', 'baz']} />
            </Model.Provider>
        </>
    )
}

TestDirective.test = {
    static: true,
    expect: () => '<input value="bar - baz">'
}


export default () => <TestSnapshots Component={TestDirective} />