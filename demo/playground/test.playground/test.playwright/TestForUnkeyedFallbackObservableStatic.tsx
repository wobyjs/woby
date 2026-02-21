import { $, $$, For, ObservableReadonly } from 'woby'
import { TestSnapshots, random } from './util'

const TestForUnkeyedFallbackObservableStatic = (): JSX.Element => {
    const Fallback = () => {
        return (
            <>
                <p>Fallback: 0.123456</p>
            </>
        )
    }
    return (
        <>
            <h3>For - Unkeyed - Fallback Observable Static</h3>
            <For values={[]} fallback={<Fallback />} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>Value: {value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedFallbackObservableStatic.test = {
    static: true,
    expect: () => '<p>Fallback: 0.123456</p>'
}


export default () => <TestSnapshots Component={TestForUnkeyedFallbackObservableStatic} />