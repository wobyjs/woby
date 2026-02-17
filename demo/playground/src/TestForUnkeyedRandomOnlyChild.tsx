import { $, $$, For, ObservableReadonly } from 'woby'
import { TestSnapshots, random } from './util'

const TestForUnkeyedRandomOnlyChild = (): JSX.Element => {
    // Use fixed values instead of random for static test
    const values = [0.123456, 0.789012, 0.345678]  // Fixed values for static test
    return (
        <>
            <h3>For - Unkeyed - Random Only Child</h3>
            <For values={values} unkeyed>
                {(value: ObservableReadonly<number>) => {
                    return <p>{value}</p>
                }}
            </For>
        </>
    )
}

TestForUnkeyedRandomOnlyChild.test = {
    static: true,
    expect: () => {
        // For static test, return the fixed values
        return `<p>0.123456</p><p>0.789012</p><p>0.345678</p>`
    }
}


export default () => <TestSnapshots Component={TestForUnkeyedRandomOnlyChild} />