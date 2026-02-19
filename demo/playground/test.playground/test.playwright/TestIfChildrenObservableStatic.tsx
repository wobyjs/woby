import { $, $$ } from 'woby'
import { If } from 'woby'
import { TestSnapshots, random, registerTestObservable, testObservables, useInterval, TEST_INTERVAL } from './util'
import { useEffect } from 'woby'

const TestIfChildrenObservableStatic = (): JSX.Element => {
    const initialValue = String(random())
    const valueObs = $(initialValue)
    registerTestObservable('TestIfChildrenObservableStatic', valueObs)
    const Content = () => {
        return <p>{valueObs()}</p>
    }


    return (
        <>
            <h3>If - Children Observable Static</h3>
            <If when={true}><Content /></If>
        </>
    )
}

TestIfChildrenObservableStatic.test = {
    static: true,
    expect: () => {
        // For static test, return the actual value from the observable
        const value = testObservables['TestIfChildrenObservableStatic']?.() ?? 'default'
        return `<p>${value}</p>`
    }
}


export default () => <TestSnapshots Component={TestIfChildrenObservableStatic} />