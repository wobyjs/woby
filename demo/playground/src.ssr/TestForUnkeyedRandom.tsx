import { $, $$ } from 'woby'
import { For } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

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
                {(value: number) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedRandom.test = {
    static: false,
    // Let TestSnapshots handle the conversion of random values to placeholders
    expect: () => {
        // The TestSnapshots component converts decimal values to 0.{random-decimal} format
        return '<p>Value: 0.{random-decimal}</p><p>Value: 0.{random-decimal}</p><p>Value: 0.{random-decimal}</p>'
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedRandom} />