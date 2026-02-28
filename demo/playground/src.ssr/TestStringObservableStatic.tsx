import { $, $$ } from 'woby'
import { TestSnapshots, random } from './util'

const TestStringObservableStatic = (): JSX.Element => {
    const initialValue = String(random())
    return (
        <>
            <h3>String - Observable Static</h3>
            <p>{initialValue}</p>
        </>
    )
}

TestStringObservableStatic.test = {
    static: true,
    // For static tests, don't use compareActualValues since we can't predict random values
    // Let the TestSnapshots component handle it with placeholder conversion
}


export default () => <TestSnapshots Component={TestStringObservableStatic} />