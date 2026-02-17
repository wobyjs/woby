import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleObservable = (): JSX.Element => {
    const o = $('green')
    registerTestObservable('TestStyleObservable', o)
    const toggle = () => o(prev => (prev === 'green') ? 'orange' : 'green')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Style - Observable</h3>
            <p style={{ color: o }}>content</p>
        </>
    )
}

TestStyleObservable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleObservable'])
        return `<p style="color: ${value};">content</p>`
    }
}


export default () => <TestSnapshots Component={TestStyleObservable} />