import { $, $$, createContext, useContext, Dynamic } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestContextDynamicContext = () => {

    const Context = createContext('default')

    const DynamicFragment = props => {
        const ctx = useContext(Context)
        return (
            <>
                <p>{ctx}</p>
                <p>{props.children}</p>
                <Dynamic component="p">{props.children}</Dynamic>
                <Dynamic component="p" children={props.children} />
            </>
        )
    }

    return (
        <>
            <h3>Dynamic - Context</h3>
            <Context.Provider value="context">
                <DynamicFragment>
                    <DynamicFragment />
                </DynamicFragment>
            </Context.Provider>
        </>
    )

}

TestContextDynamicContext.test = {
    static: true,
    expect: () => '<context-provider value="context"><p>context</p><p><p>context</p><p></p><p></p><p></p></p><p><p>context</p><p></p><p></p><p></p></p><p><p>context</p><p></p><p></p><p></p></p></context-provider>'
}


export default () => <TestSnapshots Component={TestContextDynamicContext} />