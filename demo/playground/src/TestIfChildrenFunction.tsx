import { $, $$ } from 'woby'
import { If } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, useInterval, TEST_INTERVAL } from './util'
import { useEffect } from 'woby'

const TestIfChildrenFunction = (): JSX.Element => {
    const initialValue = String(random())
    const valueObs = $(initialValue)
    registerTestObservable('TestIfChildrenFunction', valueObs)
    const Content = () => {
        return <p>{valueObs()}</p>
    }


    return (
        <>
            <h3>If - Children Function</h3>
            <If when={true}><Content /></If>
        </>
    )
}

TestIfChildrenFunction.test = {
    static: true,
    expect: () => {
        // For static test, return the actual value from the observable
        const value = testObservables['TestIfChildrenFunction']?.() ?? 'default'
        return `<p>${value}</p>`
    }
}


export default () => <TestSnapshots Component={TestIfChildrenFunction} />