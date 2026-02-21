import { $, $$ } from 'woby'
import { TestSnapshots, } from './util'

const TestBigIntStatic = (): JSX.Element => {
    return (
        <>
            <h3>BigInt - Static</h3>
            <p>{123123n}</p>
        </>
    )
}

TestBigIntStatic.test = {
    static: true,
    expect: () => '<p>123123n</p>'
}


export default () => <TestSnapshots Component={TestBigIntStatic} />