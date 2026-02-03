import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfChildrenObservableStatic = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestIfChildrenObservableStatic', initialValue)
    const o = $(initialValue)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    o()
    const Content = () => {
        return <p>{initialValue}</p>
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
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestIfChildrenObservableStatic']
        return `<p>${initialValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestIfChildrenObservableStatic} />