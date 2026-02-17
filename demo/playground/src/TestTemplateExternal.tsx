import { $, $$, template } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestTemplateExternal = (): JSX.Element => {
    const Templated = template<{ class: string, color: string }>(props => {
        return (
            <div class={props.class}>
                <span>outer <span data-color={props.color}>inner</span></span>
            </div>
        )
    })
    return (
        <>
            <h3>Template - External</h3>
            <Templated class="red" color="blue" />
            <Templated class="blue" color="red" />
        </>
    )
}

TestTemplateExternal.test = {
    static: true,
    expect: () => '<div class="red"><span>outer <span data-color="blue">inner</span></span></div><div class="blue"><span>outer <span data-color="red">inner</span></span></div>'
}


export default () => <TestSnapshots Component={TestTemplateExternal} />