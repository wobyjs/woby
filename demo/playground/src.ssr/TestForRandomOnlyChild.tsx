import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestForRandomOnlyChild = (): JSX.Element => {
    const values = $([random(), random(), random()])
    // Store the observable globally so the test can access it
    registerTestObservable('TestForRandomOnlyChild', values)
    const update = () => values([random(), random(), random()])
    useInterval(update, TEST_INTERVAL)
    return (
        <>
            <h3>For - Random</h3>
            <For values={values}>
                {(value: number) => {
                    return <p>{value}</p>
                }}
            </For>
        </>
    )
}

TestForRandomOnlyChild.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const values = $$(testObservables['TestForRandomOnlyChild'])
        return `<p>${values[0]}</p><p>${values[1]}</p><p>${values[2]}</p>`
    }
}


export default () => <TestSnapshots Component={TestForRandomOnlyChild} />