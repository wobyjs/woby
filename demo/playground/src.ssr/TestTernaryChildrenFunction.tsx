import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestTernaryChildrenFunction = (): JSX.Element => {
    const trueValue = String(random())
    const falseValue = String(random())
    registerTestObservable('TestTernaryChildrenFunction_true', trueValue)
    registerTestObservable('TestTernaryChildrenFunction_false', falseValue)
    const True = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>True: {trueValue}</p>
    }
    const False = () => {
        const o = $(String(random()))
        const randomize = () => o(String(random()))
        useInterval(randomize, TEST_INTERVAL)
        o()
        return <p>False: {falseValue}</p>
    }
    return (
        <>
            <h3>Ternary - Children Function</h3>
            <Ternary when={true}>
                {True}
                {False}
            </Ternary>
            <Ternary when={false}>
                {True}
                {False}
            </Ternary>
        </>
    )
}

TestTernaryChildrenFunction.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const trueValue = testObservables['TestTernaryChildrenFunction_true']
        const falseValue = testObservables['TestTernaryChildrenFunction_false']
        return `<p>True: ${trueValue}</p><p>False: ${falseValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestTernaryChildrenFunction} />