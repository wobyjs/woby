import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIdObservable = (): JSX.Element => {
    const o = $('foo')
    registerTestObservable('TestIdObservable', o)
    const toggle = () => o(prev => (prev === 'foo') ? 'bar' : 'foo')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>ID - Observable</h3>
            <p id={o}>content</p>
        </>
    )
}

TestIdObservable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestIdObservable'])
        return `<p id="${value}">content</p>`
    }
}


export default () => <TestSnapshots Component={TestIdObservable} />