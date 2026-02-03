import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDynamicFunctionProps = (): JSX.Element => {
    const red = { class: 'red' }
    const blue = { class: 'blue' }
    const props = $(red)
    const toggle = () => props(prev => prev === red ? blue : red)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Dynamic - Function Props</h3>
            <Dynamic component="h5" props={props}>
                Content
            </Dynamic>
        </>
    )
}

TestDynamicFunctionProps.test = {
    static: false,
    expect: () => '<h5 class="red">Content</h5>'
}


export default () => <TestSnapshots Component={TestDynamicFunctionProps} />