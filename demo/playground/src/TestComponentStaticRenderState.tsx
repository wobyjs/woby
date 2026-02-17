import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestComponentStaticRenderState = ({ value = 0 }: { value?: number }): JSX.Element => {
    const multiplier = 0
    return (
        <>
            <h3>Component - Static Render State</h3>
            <p>{(value || 0) * multiplier}</p>
        </>
    )
}

TestComponentStaticRenderState.test = {
    static: true,
    expect: () => '<p>0</p>'
}




export default () => <TestSnapshots Component={TestComponentStaticRenderState} />