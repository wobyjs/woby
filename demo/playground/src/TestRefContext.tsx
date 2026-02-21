import { $, $$, createContext } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestRefContext = (): JSX.Element => {
    const Context = createContext(123)
    return (
        <>
            <h3>Ref - Context</h3>
            <Context.Provider value={321}>
                <p>content</p>
            </Context.Provider>
        </>
    )
}

TestRefContext.test = {
    static: true,
    expect: () => '<p>content</p>'
}


export default () => <TestSnapshots Component={TestRefContext} />