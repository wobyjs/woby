import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestFragmentStaticDeep = (): JSX.Element => {
    return (
        <>
            <h3>Fragment - Static Deep</h3>
            <>
                <p>first</p>
            </>
            <>
                <p>second</p>
            </>
            <>
                <>
                    <>
                        <>
                            <p>deep</p>
                        </>
                    </>
                </>
            </>
        </>
    )
}

TestFragmentStaticDeep.test = {
    static: true,
    expect: () => '<p>first</p><p>second</p><p>deep</p>'
}


export default () => <TestSnapshots Component={TestFragmentStaticDeep} />