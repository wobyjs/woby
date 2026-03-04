import observable from '../../../soby/src/methods/observable'
import { For } from '../../src/components/for'
import { renderToString } from '../../src/methods/render_to_string'

// Test with a plain empty array (not an observable that gets updated)
const App = () => {
    return [
        { type: 'h3', children: ['For - Fallback Test'] },
        For({ values: [], fallback: { type: 'p', children: ['Fallback: static'] }, children: (value: any) => ({ type: 'p', children: ['Value: ', value] }) })
    ]
}

console.log('Test with empty array:', renderToString(App))