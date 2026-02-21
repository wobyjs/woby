import { $, $$, Ternary } from 'woby'
import { TestSnapshots, } from './util'

const TestTernaryStatic = (): JSX.Element => {
    return (
        <>
            <h3>Ternary - Static</h3>
            <Ternary when={true}>
                <p>true (1)</p>
                <p>false (1)</p>
            </Ternary>
            <Ternary when={false}>
                <p>true (2)</p>
                <p>false (2)</p>
            </Ternary>
        </>
    )
}

TestTernaryStatic.test = {
    static: true,
    expect: () => '<p>true (1)</p><p>false (2)</p>'
}


export default () => <TestSnapshots Component={TestTernaryStatic} />