import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestChildOverReexecution = (): JSX.Element => {
    const count = $(0)
    const increment = () => count(prev => Math.min(3, prev + 1))
    let executions = 0
    useTimeout(increment, TEST_INTERVAL)
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
    expect: () => '<div>1</div>0'
}


export default () => <TestSnapshots Component={TestChildOverReexecution} />