import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSVGStatic = (): JSX.Element => {
    return (
        <>
            <h3>SVG - Static</h3>
            <svg viewBox="0 0 50 50" width="50px" xmlns="http://www.w3.org/2000/svg" stroke="#ef8eb9" stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )
}

TestSVGStatic.test = {
    static: true,
    expect: () => '<svg viewBox="0 0 50 50" width="50px" xmlns="http://www.w3.org/2000/svg" stroke="#ef8eb9" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
}


export default () => <TestSnapshots Component={TestSVGStatic} />