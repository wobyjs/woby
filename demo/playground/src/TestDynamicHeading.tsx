import { $, $$, Dynamic } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDynamicHeading = (): JSX.Element => {
    const level = $(1 as 1 | 2 | 3 | 4 | 5 | 6)
    registerTestObservable('TestDynamicHeading', level)
    const increment = () => {
        const nextLevel = (level() + 1) % 7 || 1
        level(nextLevel as 1 | 2 | 3 | 4 | 5 | 6)
    }
    useInterval(increment, TEST_INTERVAL)
    return (
        <>
            <h3>Dynamic - Heading</h3>
            {() => {
                const headings = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' }
                const tag = headings[level()]
                return <Dynamic component={tag}>
                    Level: {level}
                </Dynamic>
            }}
        </>
    )
}

TestDynamicHeading.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const level = $$(testObservables['TestDynamicHeading'])
        return `<h${level}>Level: ${level}</h${level}>`
    }
}


export default () => <TestSnapshots Component={TestDynamicHeading} />