import { $, $$, Switch } from 'woby'
import { TestSnapshots, } from './util'

const TestSwitchDefaultFunction = (): JSX.Element => {
    const Default = () => {
        return <p>Default: 0.123456</p>  // Static value
    }
    return (
        <>
            <h3>Switch - Default Function</h3>
            <Switch when={-1}>
                <Switch.Case when={0}>
                    <p>case</p>
                </Switch.Case>
                <Switch.Default>
                    {Default}
                </Switch.Default>
            </Switch>
        </>
    )
}

TestSwitchDefaultFunction.test = {
    static: true,
    expect: () => '<p>Default: 0.123456</p>'
}


export default () => <TestSnapshots Component={TestSwitchDefaultFunction} />