import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestIfRace = () => {
    const data = $<{ deep: string } | null>({ deep: 'hi' })
    const visible = $(true)
    setTimeout(() => {
        data(null)
        visible(false)
    })
    return (
        <>
            <h3>If - Race</h3>
            <If when={visible}>
                <div>{() => data()!.deep}</div>
            </If>
        </>
    )
}

TestIfRace.test = {
    static: false,
    expect: () => '<div>hi</div>'
}


export default () => <TestSnapshots Component={TestIfRace} />