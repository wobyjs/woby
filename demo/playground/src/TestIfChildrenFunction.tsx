import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfChildrenFunction = (): JSX.Element => {
    const initialValue = String(random())
    registerTestObservable('TestIfChildrenFunction', initialValue)
    const o = $(initialValue)
    const randomize = () => o(String(random()))
    useInterval(randomize, TEST_INTERVAL)
    o()
    const Content = value => {
        return <p>{initialValue}</p>
    }
    return (
        <>
            <h3>If - Children Function</h3>
            <If when={true}>{Content}</If>
        </>
    )
}

TestIfChildrenFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const initialValue = testObservables['TestIfChildrenFunction']
        return `<p>${initialValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestIfChildrenFunction} />