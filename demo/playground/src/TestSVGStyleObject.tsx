import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSVGStyleObject = (): JSX.Element => {
    return (
        <>
            <h3>SVG - Style Object</h3>
            <svg style={{ stroke: 'red', fill: 'pink' }} viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )
}

TestSVGStyleObject.test = {
    static: true,
    expect: () => '<svg viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white" style="stroke: red; fill: pink;"><circle cx="25" cy="25" r="20"></circle></svg>'
}


export default () => <TestSnapshots Component={TestSVGStyleObject} />