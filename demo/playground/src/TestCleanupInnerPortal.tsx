import { $, $$, Portal } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'
import TestCleanupInner from './TestCleanupInner'

const TestCleanupInnerPortal = () => {
    return (
        <Portal mount={document.body}>
            <TestCleanupInner />
        </Portal>
    )
}

TestCleanupInnerPortal.test = {
    static: true,
    compareActualValues: true,
    expect: () => '<!---->'
}


export default () => <TestSnapshots Component={TestCleanupInnerPortal} />