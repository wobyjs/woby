import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIdFunction = (): JSX.Element => {
    const o = $('foo')
    registerTestObservable('TestIdFunction', o)
    const toggle = () => o(prev => (prev === 'foo') ? 'bar' : 'foo')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>ID - Function</h3>
            <p id={() => o()}>content</p>
        </>
    )
}

TestIdFunction.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestIdFunction'])
        return `<p id="${value}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestIdFunction} />