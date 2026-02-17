import { $, $$, If } from 'woby'
import { TestSnapshots, random } from './util'

const TestIfFallbackFunction = (): JSX.Element => {
    const initialValue = "0.123456"  // Fixed value for static test
    const Fallback = () => {
        return <p>Fallback: {initialValue}</p>
    }
    return (
        <>
            <h3>If - Fallback Function</h3>
            <If when={false} fallback={Fallback}>Children</If>
        </>
    )
}

TestIfFallbackFunction.test = {
    static: true,
    expect: () => '<p>Fallback: 0.123456</p>'
}


export default () => <TestSnapshots Component={TestIfFallbackFunction} />