import { $, $$ } from 'woby'
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
    expect: () => '<p>outer</p><p>inner</p><p>outer</p>'
}


export default () => <TestSnapshots Component={TestContextComponents} />