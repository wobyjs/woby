import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStylesMixed = (): JSX.Element => {
    return (
        <>
            <h3>Styles - Mixed</h3>
            <div style={[{ color: 'red' }, [{ fontStyle: () => 'italic' }]]}>example</div>
        </>
    )
}

TestStylesMixed.test = {
    static: true,
    expect: () => '<div style="color: red; font-style: italic;">example</div>'
}


export default () => <TestSnapshots Component={TestStylesMixed} />