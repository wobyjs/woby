import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestRefContext = (): JSX.Element => {
    const message = $('')
    const Context = createContext(123)
    const Reffed = (): JSX.Element => {
        const ref = element => message(`Got ref - Has parent: ${!!element.parentElement} - Is connected: ${element.isConnected} - Context: ${useContext(Context)}`)
        return <p ref={ref}>{message}</p>
    }
    return (
        <>
            <h3>Ref - Context</h3>
            <Context.Provider value={321}>
                <Reffed />
            </Context.Provider>
        </>
    )
}

TestRefContext.test = {
    static: false,
    expect: () => {
        // This component alternates between initial state and ref callback executed
        const isRefCallbackExecuted = Math.floor(Date.now() / TEST_INTERVAL) % 2 === 1
        return isRefCallbackExecuted
            ? '<context-provider value="321"><p>Got ref - Has parent: true - Is connected: true - Context: 321</p></context-provider>'
            : '<context-provider value="321"><p></p></context-provider>'
    }
}


export default () => <TestSnapshots Component={TestRefContext} />