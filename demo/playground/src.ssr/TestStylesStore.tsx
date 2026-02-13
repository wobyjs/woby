import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestStylesStore = (): JSX.Element => {
    const o = store({ color: 'orange', fontWeight: 'normal' })
    const toggle = () => {
        if (o.color === 'orange') {
            o.color = 'green'
            o.fontWeight = 'bold'
        } else {
            o.color = 'orange'
            o.fontWeight = 'normal'
        }
    }
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Styles - Store</h3>
            <p style={o}>content</p>
        </>
    )
}

TestStylesStore.test = {
    static: false,
    expect: () => '<p style="color: orange; font-weight: normal;">content</p>'
}


export default () => <TestSnapshots Component={TestStylesStore} />