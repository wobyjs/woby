import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestProgressIndeterminateToggle = (): JSX.Element => {
    const o = $<number | null | undefined>(.25)
    registerTestObservable('TestProgressIndeterminateToggle', o)
    const values = [.25, null, .5, undefined]
    const cycle = () => o(prev => values[(values.indexOf(prev) + 1) % values.length])
    useInterval(cycle, TEST_INTERVAL)
    return (
        <>
            <h3>Progress - Indeterminate Toggle</h3>
            <progress value={o} />
        </>
    )
}

TestProgressIndeterminateToggle.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const val = $$(testObservables['TestProgressIndeterminateToggle'])
        return (val !== null && val !== undefined) ? `<progress value="${val}"></progress>` : '<progress></progress>'
    }
}


export default () => <TestSnapshots Component={TestProgressIndeterminateToggle} />