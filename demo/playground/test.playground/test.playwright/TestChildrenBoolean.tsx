import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestChildrenBoolean = (): JSX.Element => {
    const Custom = ({ children }) => {
        return <p>{Number(children)}</p>
    }
    return (
        <>
            <h3>Children - Boolean</h3>
            <Custom>{true}</Custom>
            <Custom>{false}</Custom>
        </>
    )
}

TestChildrenBoolean.test = {
    static: true,
    expect: () => '<p>1</p><p>0</p>'
}


export default () => <TestSnapshots Component={TestChildrenBoolean} />