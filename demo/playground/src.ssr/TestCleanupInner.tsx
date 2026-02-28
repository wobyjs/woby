import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestCleanupInner = () => {
    const page = $(true)
    const togglePage = () => page(prev => !prev)
    const Page1 = () => {
        setTimeout(togglePage, TEST_INTERVAL)
        return (
            <>
                <p>page1</p>
                <button onClick={togglePage}>Toggle Page</button>
            </>
        )
    }
    const Page2 = () => {
        const bool = $(true)
        const toggle = () => bool(prev => !prev)
        setTimeout(toggle, TEST_INTERVAL)
        setTimeout(togglePage, TEST_INTERVAL * 2)
        return (
            <>
                <If when={bool}>
                    <p>page2 - true</p>
                </If>
                <If when={() => !bool()}>
                    <p>page2 - false</p>
                </If>
                <button onClick={toggle}>Toggle</button>
                <button onClick={togglePage}>Toggle Page</button>
            </>
        )
    }
    return () => {
        const Page = page() ? Page1 : Page2
        return (
            <>
                <h3>Cleanup - Inner</h3>
                <Page />
            </>
        )
    }
}

TestCleanupInner.test = {
    static: false,
    expect: () => '<p>page1</p><button>Toggle Page</button>'
}


export default () => <TestSnapshots Component={TestCleanupInner} />