import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStyleFunctionVariable = (): JSX.Element => {
    const o = $('green')
    registerTestObservable('TestStyleFunctionVariable', o)
    const toggle = () => o(prev => (prev === 'orange') ? 'green' : 'orange')
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Style - Function Variable</h3>
            <p style={{ color: 'var(--color)', '--color': () => o() }}>content</p>
        </>
    )
}

TestStyleFunctionVariable.test = {
    static: false,
    expect: () => {
        const value = $$(testObservables['TestStyleFunctionVariable'])
        return `<p style="color: var(--color); --color: ${value};">content</p>`
    }
}


export default () => <TestSnapshots Component={TestStyleFunctionVariable} />