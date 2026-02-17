import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestRefUnmounting = (): JSX.Element => {
    const message = $('No ref') // Static value
    return (
        <>
            <h3>Ref - Unmounting</h3>
            <p>{message}</p>
            <p>content</p> {/* Static content, not conditional */}
        </>
    )
}

TestRefUnmounting.test = {
    static: true,
    wrap: false,
    expect: () => '<p>No ref</p><p>content</p> '
}


export default () => <TestSnapshots Component={TestRefUnmounting} />