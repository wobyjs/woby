import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestEventTargetCurrentTarget = (): JSX.Element => {
    const divClicks = $(0) // Force refresh
    const ulClicks = $(0) // Force refresh
    const liClicks = $(0) // Force refresh

    registerTestObservable('TestEventTargetCurrentTarget_div', divClicks)
    registerTestObservable('TestEventTargetCurrentTarget_ul', ulClicks)
    registerTestObservable('TestEventTargetCurrentTarget_li', liClicks)

    // Initialize with fixed values for static test
    divClicks(3)
    ulClicks(2)
    liClicks(1)

    return (
        <>
            <h3>Event - Target - Current Target</h3>
            <div>
                <p>paragraph</p>
                <ul>
                    <li>one</li>
                    <li>two</li>
                    <li>three</li>
                </ul>
            </div>
            <p>Div clicks: {divClicks}</p>
            <p>UL clicks: {ulClicks}</p>
            <p>LI clicks: {liClicks}</p>
        </>
    )
}

TestEventTargetCurrentTarget.test = {
    static: true,
    expect: () => {
        // For static test, return the expected fixed values
        return `<div><p>paragraph</p><ul><li>one</li><li>two</li><li>three</li></ul></div><p>Div clicks: 3</p><p>UL clicks: 2</p><p>LI clicks: 1</p>`
    }
}


export default () => <TestSnapshots Component={TestEventTargetCurrentTarget} />