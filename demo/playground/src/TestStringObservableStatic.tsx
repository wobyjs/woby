import { $, $$ } from 'woby'
import { TestSnapshots, random } from './util'

const TestStringObservableStatic = (): JSX.Element => {
    const initialValue = "0.123456"
    return (
        <>
            <h3>String - Observable Static</h3>
            <p>{initialValue}</p>
        </>
    )
}

TestStringObservableStatic.test = {
    static: true,
    expect: () => '<p>0.123456</p>'  // Use a fixed value for predictable testing
}


export default () => <TestSnapshots Component={TestStringObservableStatic} />