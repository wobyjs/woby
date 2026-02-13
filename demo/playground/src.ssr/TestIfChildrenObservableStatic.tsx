import { $, $$ } from 'woby'
import { If } from 'woby'
import { TestSnapshots, random } from './util'

const TestIfChildrenObservableStatic = (): JSX.Element => {
    const initialValue = String(random())
    const Content = () => {
        return <p>{initialValue}</p>
    }
    return (
        <>
            <h3>If - Children Observable Static</h3>
            <If when={true}><Content /></If>
        </>
    )
}

TestIfChildrenObservableStatic.test = {
    static: true,
    // For static tests, don't use compareActualValues since we can't predict random values
    // Let the TestSnapshots component handle it with placeholder conversion
}


export default () => <TestSnapshots Component={TestIfChildrenObservableStatic} />