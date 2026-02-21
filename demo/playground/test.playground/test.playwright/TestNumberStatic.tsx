import { $, $$ } from 'woby'
import { TestSnapshots, } from './util'

const TestNumberStatic = (): JSX.Element => {
    return (
        <>
            <h3>Number - Static</h3>
            <p>{123}</p>
        </>
    )
}

TestNumberStatic.test = {
    static: true,
    expect: () => '<p>123</p>'
}


export default () => <TestSnapshots Component={TestNumberStatic} />