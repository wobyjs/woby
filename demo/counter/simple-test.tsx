import { $, renderToString } from 'woby/ssr'

const SimpleApp = () => {
    const value = $(0)
    return <div>Hello World: {value}</div>
}

const result = renderToString(<SimpleApp />)
console.log('Rendered HTML:')
console.log(result)
console.log('--- End of rendered HTML ---')