import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForUnkeyedRandomOnlyChild = (): JSX.Element => {
    const values = $([random(), random(), random()])
    // Store the observable globally so the test can access it
    registerTestObservable('TestForUnkeyedRandomOnlyChild', values)
    const update = () => values([random(), random(), random()])
    useInterval(update, TEST_INTERVAL)
    return (
        <>
            <h3>For - Unkeyed - Random Only Child</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>{value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedRandomOnlyChild.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const values = $$(testObservables['TestForUnkeyedRandomOnlyChild'])
        return `<p>${values[0]}</p><p>${values[1]}</p><p>${values[2]}</p>`
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedRandomOnlyChild} />