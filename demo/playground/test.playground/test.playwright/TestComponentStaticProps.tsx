import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestComponentStaticProps = ({ value }: { value: number }): JSX.Element => {
    registerTestObservable('TestComponentStaticProps', $(value))
    return (
        <>
            <h3>Component - Static Props</h3>
            <p>{value}</p>
        </>
    )
}

TestComponentStaticProps.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const propValue = $$(testObservables['TestComponentStaticProps'])
        return `<p>${propValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestComponentStaticProps} props={{ value: random() }} />