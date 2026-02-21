import { $, $$, If } from 'woby'
import { TestSnapshots } from './util'

const TestIfNestedFunctionNarrowed = (): JSX.Element => {
    // Static value for static test
    return (
        <>
            <h3>If - Nested Function Narrowed</h3>
            <p>(<If when={true}>{value => 0}</If>)</p>
        </>
    )
}

TestIfNestedFunctionNarrowed.test = {
    static: true,
    expect: () => '<p>(0)</p>'
}


export default () => <TestSnapshots Component={TestIfNestedFunctionNarrowed} />