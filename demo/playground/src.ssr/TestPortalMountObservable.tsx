import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestPortalMountObservable = (): JSX.Element => {
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')
    const mount = $(div1)
    const toggle = () => mount(prev => prev === div1 ? div2 : div1)
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Portal - Mount Observable</h3>
            {div1}
            {div2}
            <Portal mount={mount}>
                <p>content</p>
            </Portal>
        </>
    )
}

TestPortalMountObservable.test = {
    static: false,
    compareActualValues: true,
    expect: () => '<!---->'
}


export default () => <TestSnapshots Component={TestPortalMountObservable} />