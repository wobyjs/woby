import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestClassNameFunction = (): JSX.Element => {
    const o = $('red')
    const toggle = () => o(prev => (prev === 'red') ? 'blue' : 'red')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>ClassName - Function</h3>
            <p class={() => o()}>content</p>
        </>
    )
}

TestClassNameFunction.test = {
    static: false,
    expect: () => '<p class="{random-class}">content</p>'
}


export default () => <TestSnapshots Component={TestClassNameFunction} />