import { $, $$, Portal } from 'woby'
import { TestSnapshots } from './util'

const TestPortalMountObservable = (): JSX.Element => {
    // Use a fixed DOM element for portal mounting in static test
    const containerId = 'portal-container'
    let container = document.getElementById(containerId)
    if (!container) {
        container = document.createElement('div')
        container.id = containerId
        document.body.appendChild(container)
    }

    return (
        <>
            <h3>Portal - Mount Observable</h3>
            <Portal mount={container}>
                <p>content</p>
            </Portal>
        </>
    )
}

TestPortalMountObservable.test = {
    static: true,
    expect: () => '<!---->'
}


export default () => <TestSnapshots Component={TestPortalMountObservable} />