import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestRefUnmounting = (): JSX.Element => {
    const message = $('')
    const mounted = $(true)
    const ref = $<HTMLElement>()
    const toggle = () => mounted(prev => !prev)
    useInterval(toggle, TEST_INTERVAL)
    useEffect(() => {
        const element = ref()
        if (element) {
            message(`Got ref - Has parent: ${!!element.parentElement} - Is connected: ${element.isConnected}`)
        } else {
            message(`No ref`)
        }
    }, { sync: true })
    return (
        <>
            <h3>Ref - Unmounting</h3>
            <p>{message}</p>
            <If when={mounted}>
                <p ref={ref}>content</p>
            </If>
        </>
    )
}

TestRefUnmounting.test = {
    static: false,
    wrap: false,
    expect: () => {
        // This component alternates between mounted and unmounted states
        const cyclePhase = Math.floor(Date.now() / TEST_INTERVAL) % 7
        const states = [
            '<p>No ref</p><p>content</p>',
            '<p>Got ref - Has parent: true - Is connected: true</p><p>content</p>',
            '<p>Got ref - Has parent: true - Is connected: true</p><!---->',
            '<p>Got ref - Has parent: true - Is connected: true</p><p>content</p>',
            '<p>Got ref - Has parent: true - Is connected: true</p><!---->',
            '<p>Got ref - Has parent: true - Is connected: true</p><p>content</p>',
            '<p>Got ref - Has parent: true - Is connected: true</p><!---->'
        ]
        return states[cyclePhase]
    }
}


export default () => <TestSnapshots Component={TestRefUnmounting} />