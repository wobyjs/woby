import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestComponentStaticProps = ({ value }: { value: number }): JSX.Element => {
    const propValue = random()
    registerTestObservable('TestComponentStaticProps', propValue)
    return (
        <>
            <h3>Component - Static Props</h3>
            <p>{propValue}</p>
        </>
    )
}

TestComponentStaticProps.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const propValue = testObservables['TestComponentStaticProps']
        return `<p>${propValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestComponentStaticProps} />