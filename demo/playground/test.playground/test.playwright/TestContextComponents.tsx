import { $, $$, createContext, useContext } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestContextComponents = (): JSX.Element => {
    const Context = createContext('')
    return (
        <>
            <h3>Context - Components</h3>
            <Context.Provider value="outer">
                {() => {
                    const value = useContext(Context)
                    return <p>{value}</p>
                }}
                <Context.Provider value="inner">
                    {() => {
                        const value = useContext(Context)
                        return <p>{value}</p>
                    }}
                </Context.Provider>
                {() => {
                    const value = useContext(Context)
                    return <p>{value}</p>
                }}
            </Context.Provider>
        </>
    )
}

TestContextComponents.test = {
    static: true,
    expect: () => '<context-provider value="outer"><p>outer</p><context-provider value="inner"><p>inner</p></context-provider><p>outer</p></context-provider>'
}


export default () => <TestSnapshots Component={TestContextComponents} />