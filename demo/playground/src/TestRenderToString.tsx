import { $, $$, renderToString } from 'woby'
import { TestSnapshots } from './util'

const TestRenderToString = (): JSX.Element => {
    // Static component that returns the expected structure
    return (
        <div>
            <h3>renderToString</h3>
            <p>123</p>
        </div>
    )
}

TestRenderToString.test = {
    static: true,
    expect: () => '<div><p>123</p></div>'
}


export default () => <TestSnapshots Component={TestRenderToString} />