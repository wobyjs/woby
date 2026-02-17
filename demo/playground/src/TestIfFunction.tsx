import { $, $$, If } from 'woby'
import { TestSnapshots } from './util'

const TestIfFunction = (): JSX.Element => {
    // Static value for static test
    return (
        <>
            <h3>If - Function</h3>
            <p>(<If when={true}>content</If>)</p>
        </>
    )
}

TestIfFunction.test = {
    static: true,
    expect: () => '<p>(content)</p>'
}


export default () => <TestSnapshots Component={TestIfFunction} />