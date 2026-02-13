import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestRefUntrack = (): JSX.Element => {
    const o = $(0)
    const increment = () => o(prev => prev + 1)
    useInterval(increment, TEST_INTERVAL)

    const Reffed = hmr(() => { }, (): JSX.Element => {
        const ref = element => element.textContent = o()
        return <p ref={ref}>content</p>
    })

    return (
        <>
            <h3>Ref - Untrack</h3>
            <Reffed />
        </>
    )
}

TestRefUntrack.test = {
    static: true,
    expect: () => '<p>0</p>'
}


export default () => <TestSnapshots Component={TestRefUntrack} />