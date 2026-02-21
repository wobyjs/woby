import { $, $$, Fragment } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestFragmentStaticComponent = (): JSX.Element => {
    return (
        <Fragment>
            <h3>Fragment - Static Component</h3>
            <p>content</p>
        </Fragment>
    )
}

TestFragmentStaticComponent.test = {
    static: true,
    expect: () => '<p>content</p>'
}


export default () => <TestSnapshots Component={TestFragmentStaticComponent} />