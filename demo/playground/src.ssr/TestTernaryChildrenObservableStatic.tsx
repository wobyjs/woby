import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestTernaryChildrenObservableStatic = (): JSX.Element => {
    const trueValue = String(random())
    const falseValue = String(random())
    registerTestObservable('TestTernaryChildrenObservableStatic_true', trueValue)
    registerTestObservable('TestTernaryChildrenObservableStatic_false', falseValue)
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
            <h3>Ternary - Children Observable Static</h3>
            <Ternary when={true}>
                <True />
                <False />
            </Ternary>
            <Ternary when={false}>
                <True />
                <False />
            </Ternary>
        </>
    )
}

TestTernaryChildrenObservableStatic.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const trueValue = testObservables['TestTernaryChildrenObservableStatic_true']
        const falseValue = testObservables['TestTernaryChildrenObservableStatic_false']
        return `<p>True: ${trueValue}</p><p>False: ${falseValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestTernaryChildrenObservableStatic} />