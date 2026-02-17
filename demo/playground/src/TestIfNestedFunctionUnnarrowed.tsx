import { $, $$, If } from 'woby'
import { TestSnapshots } from './util'

const TestIfNestedFunctionUnnarrowed = (): JSX.Element => {
    // Static value for static test
    const content = 0  // Fixed value to ensure it stays at 0
    return (
        <>
            <h3>If - Nested Function Unnarrowed</h3>
            <p>(<If when={true}>{() => content}</If>)</p>
        </>
    )
}

TestIfNestedFunctionUnnarrowed.test = {
    static: true,
    expect: () => '<p>(0)</p>'
}


export default () => <TestSnapshots Component={TestIfNestedFunctionUnnarrowed} />