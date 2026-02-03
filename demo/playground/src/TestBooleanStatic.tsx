import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestBooleanStatic = (): JSX.Element => {
    return (
        <>
            <h3>Boolean - Static</h3>
            <p>{true}{false}</p>
        </>
    )
}

TestBooleanStatic.test = {
    static: true,
    expect: () => '<p><!----></p>'
}


export default () => <TestSnapshots Component={TestBooleanStatic} />