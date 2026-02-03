import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForUnkeyedRandom = (): JSX.Element => {
    const values = $([random(), random(), random()])
    // Store the observable globally so the test can access it
    registerTestObservable('TestForUnkeyedRandom', values)
    const update = () => {
        const newValues = [random(), random(), random()]
        values(newValues)
    }
    useInterval(update, TEST_INTERVAL)
    return (
        <>
            <h3>For - Unkeyed - Random</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedRandom.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const values = $$(testObservables['TestForUnkeyedRandom'])
        if (values && values.length >= 3) {
            return `<p>Value: ${values[0]}</p><p>Value: ${values[1]}</p><p>Value: ${values[2]}</p>`
        } else {
            return '<p>Value: </p><p>Value: </p><p>Value: </p>'
        }
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedRandom} />