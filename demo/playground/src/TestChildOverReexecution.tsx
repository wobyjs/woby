import { $, $$, useEffect } from 'woby'
import { TestSnapshots, useTimeout, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestChildOverReexecution = (): JSX.Element => {
    const count = $(0)
    let executions = 0
    registerTestObservable('TestChildOverReexecution', count)

    const increment = () => count(prev => Math.min(3, prev + 1))

    // Expose increment function for testing
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).testChildOverReexecutionIncrement = increment
        }
    })

    // For playground testing, add automatic increment
    useEffect(() => {
        const interval = setInterval(() => {
            if ($$(count) < 6) {
                increment()
            }
        }, 1000)

        return () => clearInterval(interval)
    })

    return (
        <>
            <h3>Child - OverReexecution</h3>
            <div>
                {() => executions += 1}
            </div>
            {count}
        </>
    )
}

TestChildOverReexecution.test = {
    static: false,
    expect: () => {
        const observable = testObservables['TestChildOverReexecution']
        if (observable) {
            const currentValue = $$(observable)
            return `<div>1</div>${currentValue}`
        }
        return `<div>1</div>0`
    }
}


export default () => <TestSnapshots Component={TestChildOverReexecution} />