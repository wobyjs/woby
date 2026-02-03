import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStylesCleanup = (): JSX.Element => {
    const o = $<JSX.StyleProperties>({ color: 'orange', fontWeight: 'bold' })
    const toggle = () => o(prev => (prev.color === 'orange') ? { fontStyle: 'italic', textDecoration: 'line-through' } : { color: 'orange', fontWeight: 'bold' })
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Styles - Observable Cleanup</h3>
            <p style={o}>content</p>
        </>
    )
}

TestStylesCleanup.test = {
    static: false,
    expect: () => '<p style="color: orange; font-weight: bold;">content</p>'
}


export default () => <TestSnapshots Component={TestStylesCleanup} />