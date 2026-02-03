import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestFragmentStaticComponent = (): JSX.Element => {
    return (
        <Woby.Fragment>
            <h3>Fragment - Static Component</h3>
            <p>content</p>
        </Woby.Fragment>
    )
}

TestFragmentStaticComponent.test = {
    static: true,
    expect: () => '<p>content</p>'
}


export default () => <TestSnapshots Component={TestFragmentStaticComponent} />