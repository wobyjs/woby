import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestTernaryStaticInline = (): JSX.Element => {
    return (
        <>
            <h3>Ternary - Static Inline</h3>
            <Ternary when={true}><p>true (1)</p><p>false (1)</p></Ternary>
            <Ternary when={false}><p>true (2)</p><p>false (2)</p></Ternary>
        </>
    )
}

TestTernaryStaticInline.test = {
    static: true,
    expect: () => '<p>true (1)</p><p>false (2)</p>'
}


export default () => <TestSnapshots Component={TestTernaryStaticInline} />