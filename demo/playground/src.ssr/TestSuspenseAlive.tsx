import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestSuspenseAlive = (): JSX.Element => {
    const whenObservable = $(true)
    const fallbackObservable = $(0)
    const contentObservable = $(0)
    const fallbackValue = $(random())
    const contentValue = $(random())
    registerTestObservable('TestSuspenseAlive', whenObservable)
    registerTestObservable('TestSuspenseAlive_fallback', fallbackValue)
    registerTestObservable('TestSuspenseAlive_content', contentValue)
    registerTestObservable('TestSuspenseAlive_fallback_count', fallbackObservable)
    registerTestObservable('TestSuspenseAlive_content_count', contentObservable)
    const Fallback = () => {
        return <p onClick={() => {
            fallbackObservable(fallbackObservable() + 1)
            whenObservable(false)
        }}>Loading ({$$(fallbackValue)})...</p>
    }
    const Content = () => {
        return <p onClick={() => {
            contentObservable(contentObservable() + 1)
            whenObservable(true)
        }}>Content ({$$(contentValue)})!</p>
    }
    const toggle = () => {
        whenObservable(prev => !prev)
        // Update fallback and content values when toggling to ensure sync
        fallbackValue(random())
        contentValue(random())
    }
    useInterval(toggle, TEST_INTERVAL)
    return (
        <>
            <h3>Suspense - Alive</h3>
            <Suspense when={whenObservable} fallback={<Fallback />}>
                <Content />
            </Suspense>
        </>
    )
}

TestSuspenseAlive.test = {
    static: false,
    compareActualValues: true,
    expect: () => {
        const fallbackCount = $$(testObservables['TestSuspenseAlive_fallback_count']) || 0
        const contentCount = $$(testObservables['TestSuspenseAlive_content_count']) || 0
        const fallbackValue = $$(testObservables['TestSuspenseAlive_fallback'])
        const contentValue = $$(testObservables['TestSuspenseAlive_content'])
        // Determine state based on which element was clicked last
        const isContentVisible = contentCount > fallbackCount
        return isContentVisible ? `<p>Content (${contentValue})!</p>` : `<p>Loading (${fallbackValue})...</p>`
    }
}


export default () => <TestSnapshots Component={TestSuspenseAlive} />