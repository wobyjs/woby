import { $, $$, If } from 'woby'
import { TestSnapshots } from './util'

const TestIfObservable = (): JSX.Element => {
    // Static value for static test
    return (
        <>
            <h3>If - Observable</h3>
            <p>(<If when={true}>content</If>)</p>
        </>
    )
}

TestIfObservable.test = {
    static: true,
    expect: () => '<p>(content)</p>'
}


export default () => <TestSnapshots Component={TestIfObservable} />