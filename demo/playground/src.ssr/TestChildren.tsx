import { $, $$ } from 'woby'
import { TestSnapshots, useInterval, TEST_INTERVAL, registerTestObservable, testObservables } from './util'

const TestChildren = (): JSX.Element => {
    const A = ({ children }): JSX.Element => {
        return <div class="A">{children}</div>
    }
    const B = ({ children }): JSX.Element => {
        return <div class="B">{children}</div>
    }
    const C = ({ children }): JSX.Element => {
        return <div class="C">{children}</div>
    }
    return (
        <>
            <h3>Children</h3>
            <A>
                <B>
                    <C>
                        <p>content</p>
                    </C>
                </B>
            </A>
        </>
    )
}

TestChildren.test = {
    static: true,
    expect: () => '<div class="A"><div class="B"><div class="C"><p>content</p></div></div></div>'
}


export default () => <TestSnapshots Component={TestChildren} />