import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestDynamicObservableChildren = (): JSX.Element => {
    const o = $(random())
    registerTestObservable('TestDynamicObservableChildren', o)
    const update = () => o(random())
    useInterval(update, TEST_INTERVAL)
    return (
        <>
            <h3>Dynamic - Observable Children</h3>
            <Dynamic component="h5">
                {o}
            </Dynamic>
        </>
    )
}

TestDynamicObservableChildren.test = {
    static: false,
    compareActualValues: true,
    expect: () => `<h5>${$$(testObservables['TestDynamicObservableChildren'])}</h5>`
}


export default () => <TestSnapshots Component={TestDynamicObservableChildren} />