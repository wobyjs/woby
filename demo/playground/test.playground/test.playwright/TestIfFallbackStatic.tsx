import { $, $$ } from 'woby'
import { TestSnapshots, } from './util'

const TestIfFallbackStatic = (): JSX.Element => {
    return (
        <>
            <h3>If - Fallback Static</h3>
            <If when={false} fallback={<p>Fallback!</p>}>Children</If>
        </>
    )
}

TestIfFallbackStatic.test = {
    static: true,
    expect: () => '<p>Fallback!</p>'
}


export default () => <TestSnapshots Component={TestIfFallbackStatic} />