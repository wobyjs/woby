// Simple test to debug multiple children rendering issue in SSR
const { renderToString, jsx } = require('./dist/ssr.cjs.js');

// Simple test component with one child
const SingleChild = () => {
    return jsx('div', {
        children: jsx('h1', {
            children: 'Single Child'
        })
    });
};

// Simple test component with multiple children
const MultiChild = () => {
    return jsx('div', {
        children: [
            jsx('h1', {
                children: 'Child 1'
            }),
            jsx('h2', {
                children: 'Child 2'
            })
        ]
    });
};

console.log('Testing single child:');
const singleResult = renderToString(SingleChild());
console.log(singleResult);

console.log('\nTesting multiple children:');
const multiResult = renderToString(MultiChild());
console.log(multiResult);

console.log('\n--- End of tests ---');