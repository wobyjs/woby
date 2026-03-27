import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables, random } from './util'

const TestComponentStaticRenderProps = ({ value }: { value: number }): JSX.Element => {
    const propValue = random()
    registerTestObservable('TestComponentStaticRenderProps', propValue)
    return (
        <>
            <h3>Component - Static Render Props</h3>
            <p>{propValue}</p>
        </>
    )
}

TestComponentStaticRenderProps.test = {
    static: true,
    compareActualValues: true,
    expect: () => {
        const propValue = testObservables['TestComponentStaticRenderProps']
        return `<p>${propValue}</p>`
    }
}


export default () => <TestSnapshots Component={TestComponentStaticRenderProps} />