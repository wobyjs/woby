import { $, $$, useEffect } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

// Custom useTimeout that runs once after delay
const useTimeout = (callback, delay) => {
    const hasRun = $(false)

    useEffect(() => {
        if (hasRun()) return

        let timeoutId

        const tick = () => {
            if ($$(hasRun)) return
            callback()
            hasRun(true)
        }

        if (delay && !hasRun()) {
            timeoutId = useTimeout(tick, delay)
        }

        // Cleanup function
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
        }
    })
}

const TestChildOverReexecution = (): JSX.Element => {
    const count = $(0)
    const increment = () => count(prev => Math.min(3, prev + 1))
    // Store the observable globally so the test can access it
    registerTestObservable('TestChildOverReexecution', count)
    const executions = 0

    useTimeout(increment, TEST_INTERVAL)
    return (
        <>
            <h3>Child - OverReexecution</h3>
            <div>
                {() => executions + 1}
            </div>
            {count}
        </>
    )
}

TestChildOverReexecution.test = {
    static: false,
    expect: () => {
        const countValue = $$(testObservables['TestChildOverReexecution'])
        return `<div>1</div>${countValue}`
    }
}


export default () => <TestSnapshots Component={TestChildOverReexecution} />