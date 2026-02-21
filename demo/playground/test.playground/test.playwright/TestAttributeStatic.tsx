import { $, $$ } from 'woby'
import { TestSnapshots, } from './util'

const TestAttributeStatic = (): JSX.Element => {
    return (
        <>
            <h3>Attribute - Static</h3>
            <p data-color="red">content</p>
        </>
    )
}

TestAttributeStatic.test = {
    static: true,
    expect: () => '<p data-color="red">content</p>'
}


export default () => <TestSnapshots Component={TestAttributeStatic} />