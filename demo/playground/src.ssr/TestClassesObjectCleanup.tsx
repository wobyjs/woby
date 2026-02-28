import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassesObjectCleanup = (): JSX.Element => {
    const o = $<JSX.ClassProperties>({ red: true })
    const toggle = () => o(prev => prev.red ? { blue: true } : { red: true })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Classes - Object Cleanup</h3>
            <p class={o}>content</p>
        </>
    )
}

TestClassesObjectCleanup.test = {
    static: false,
    expect: () => '<p class="red">content</p>'
}


export default () => <TestSnapshots Component={TestClassesObjectCleanup} />