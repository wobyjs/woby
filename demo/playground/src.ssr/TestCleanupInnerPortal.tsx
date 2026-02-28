import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestCleanupInnerPortal = () => {
    return (
        <Portal mount={document.body}>
            <TestCleanupInner />
        </Portal>
    )
}

TestCleanupInnerPortal.test = {
    static: true,
    expect: () => ''
}


export default () => <TestSnapshots Component={TestCleanupInnerPortal} />