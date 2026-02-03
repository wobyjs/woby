import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSimpleExpect = (): JSX.Element => {
    const value = $("Hello World")
    registerTestObservable('TestSimpleExpect', value)
    return (
        <>
            <h3>Simple Expect Test</h3>
            <p>{value}</p>
        </>
    )
}

TestSimpleExpect.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const value = $$(testObservables['TestSimpleExpect'])
        return `<p>${value}</p>`
    }
}


export default () => <TestSnapshots Component={TestSimpleExpect} />