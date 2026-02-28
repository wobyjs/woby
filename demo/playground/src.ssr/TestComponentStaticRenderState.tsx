import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestComponentStaticRenderState = ({ value }: { value: number }): JSX.Element => {
    const multiplier = 0
    return (
        <>
            <h3>Component - Static Render State</h3>
            <p>{value * multiplier}</p>
        </>
    )
}

TestComponentStaticRenderState.test = {
    static: true,
    expect: () => '<p>0</p>'
}

// Experimental component format that returns an object with test JSX and expect function
// This allows for direct value comparison using $$(observable) instead of placeholder patterns

// Global store for observables used in tests
const testObservables: Record<string, any> = {}

// Helper function to register observables for tests
const registerTestObservable = (name: string, observable: any) => {
    testObservables[name] = observable
    return observable
}


export default () => <TestSnapshots Component={TestComponentStaticRenderState} />