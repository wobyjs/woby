import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestChildrenSymbol = (): JSX.Element => {
    const Custom = ({ children }) => {
        return <p>{typeof children}</p>
    }
    return (
        <>
            <h3>Children - Boolean</h3>
            <Custom>{Symbol()}</Custom>
        </>
    )
}

TestChildrenSymbol.test = {
    static: true,
    expect: () => '<p>symbol</p>'
}


export default () => <TestSnapshots Component={TestChildrenSymbol} />