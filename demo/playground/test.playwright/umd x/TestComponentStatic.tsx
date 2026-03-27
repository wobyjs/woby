import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestComponentStatic = (): JSX.Element => {
    return (
        <>
            <h3>Component - Static</h3>
            <p>content</p>
        </>
    )
}

TestComponentStatic.test = {
    static: true,
    expect: () => '<p>content</p>'
}


export default () => <TestSnapshots Component={TestComponentStatic} />