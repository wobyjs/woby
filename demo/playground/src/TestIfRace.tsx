import { $, $$, If } from 'woby'
import { TestSnapshots } from './util'

const TestIfRace = () => {
    const data = { deep: 'hi' }  // Static data for static test
    const visible = true  // Static value for static test
    return (
        <>
            <h3>If - Race</h3>
            <If when={visible}>
                <div>{data?.deep || ''}</div>
            </If>
        </>
    )
}

TestIfRace.test = {
    static: true,
    expect: () => '<div>hi</div>'
}


export default () => <TestSnapshots Component={TestIfRace} />