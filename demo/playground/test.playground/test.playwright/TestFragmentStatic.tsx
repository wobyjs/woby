import { $, $$ } from 'woby'
import { TestSnapshots, } from './util'

const TestFragmentStatic = (): JSX.Element => {
    return (
        <>
            <h3>Fragment - Static</h3>
            <p>content</p>
        </>
    )
}

TestFragmentStatic.test = {
    static: true,
    expect: () => '<p>content</p>'
}


export default () => <TestSnapshots Component={TestFragmentStatic} />