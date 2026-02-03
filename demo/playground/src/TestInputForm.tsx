import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestInputForm = (): JSX.Element => {
    return (
        <>
            <h3>Input - Input Form</h3>
            <input form={undefined} />
            <input form={null} />
            <input form="foo" />
        </>
    )
}

TestInputForm.test = {
    static: true,
    expect: () => '<input><input><input form="foo">'
}


export default () => <TestSnapshots Component={TestInputForm} />