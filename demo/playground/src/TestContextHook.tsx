import { $, $$, createContext, useContext } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestContextHook = (): JSX.Element => {
    const Context = createContext('')
    const Reader = (): JSX.Element => {
        const value = useContext(Context)
        return <p>{value}</p>
    }
    return (
        <>
            <h3>Context - Hook</h3>
            <Context.Provider value="outer">
                <Reader />
                <Context.Provider value="inner">
                    <Reader />
                </Context.Provider>
                <Reader />
            </Context.Provider>
        </>
    )
}

TestContextHook.test = {
    static: true,
    expect: () => '<context-provider value="outer"><p>outer</p><context-provider value="inner"><p>inner</p></context-provider><p>outer</p></context-provider>'
}


export default () => <TestSnapshots Component={TestContextHook} />