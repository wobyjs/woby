import { $, $$, If } from 'woby'
import { TestSnapshots } from './util'

const TestIfFunctionUntracked = (): JSX.Element => {
    // Static values for static test
    return (
        <>
            <If when={true}>
                <If when={true} fallback="fallback">
                    {() => (
                        <button onClick={() => { }}>
                            Close
                        </button>
                    )}
                </If>
            </If>
        </>
    )
}

TestIfFunctionUntracked.test = {
    static: true,
    expect: () => '<button>Close</button>'
}


export default () => <TestSnapshots Component={TestIfFunctionUntracked} />