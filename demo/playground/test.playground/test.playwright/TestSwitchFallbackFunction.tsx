import { $, $$, Switch } from 'woby'
import { TestSnapshots, } from './util'

const TestSwitchFallbackFunction = (): JSX.Element => {
    const Fallback = () => {
        return <p>Fallback: 0.123456</p>  // Static value
    }
    return (
        <>
            <h3>Switch - Fallback Function</h3>
            <Switch when={-1} fallback={Fallback}>
                <Switch.Case when={0}>
                    <p>case</p>
                </Switch.Case>
            </Switch>
        </>
    )
}

TestSwitchFallbackFunction.test = {
    static: true,
    expect: () => '<p>Fallback: 0.123456</p>'
}

// Remove the additional test components


export default () => <TestSnapshots Component={TestSwitchFallbackFunction} />