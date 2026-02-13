import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSVGClassObject = (): JSX.Element => {
    return (
        <>
            <h3>SVG - Class Object</h3>
            <svg class={{ red: true }} viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white">
                <circle cx="25" cy="25" r="20" />
            </svg>
        </>
    )
}

TestSVGClassObject.test = {
    static: true,
    expect: () => '<svg class="red" viewBox="0 0 50 50" width="50px" stroke-width="3" fill="white"><circle cx="25" cy="25" r="20"></circle></svg>'
}


export default () => <TestSnapshots Component={TestSVGClassObject} />