import { jsx as _jsx, jsxs as _jsxs } from "woby/jsx-runtime";
/// @jsxImportSource woby
/// @jsxRuntime automatic
/**
 * Test to compare JSX syntax vs direct jsx() calls
 *
 * FIXED: The DirectTest was incorrectly passing children as a property in the props object,
 * which caused a double child issue where elements were rendered twice.
 *
 * Correct usage of jsx() function:
 * jsx(component, props, ...children)
 */
import { renderToString, jsx } from 'woby';
// Test with JSX syntax
const JSXTest = () => {
    return (_jsxs("div", { children: [_jsx("h1", { children: "JSX Child 1" }), _jsx("h2", { children: "JSX Child 2" }), _jsxs("div", { children: [_jsx("p", { children: "Nested child 1" }), _jsx("p", { children: "Nested child 2" }), _jsx("span", { children: _jsx("strong", { children: "Deeply nested child" }) })] })] }));
};
// Test with direct jsx() calls (NOW FIXED)
const DirectTest16 = () => {
    return jsx('div', null, jsx('h1', null, 'Direct Child 1'), jsx('h2', null, 'Direct Child 2'), jsx('div', null, jsx('p', null, 'Nested child 1'), jsx('p', null, 'Nested child 2'), jsx('span', null, jsx('strong', null, 'Deeply nested child'))));
};
// Test with direct jsx() calls (NOW FIXED)
const DirectTest17 = () => {
    return jsx('div', {
        children: [
            jsx('h1', { children: 'Direct Child 1' }),
            jsx('h2', { children: 'Direct Child 2' }),
            jsx('div', {
                children: [
                    jsx('p', { children: 'Nested child 1' }),
                    jsx('p', { children: 'Nested child 2' }),
                    jsx('span', {
                        children: jsx('strong', { children: 'Deeply nested child' })
                    })
                ]
            })
        ]
    });
};
console.log('=== JSX vs Direct jsx() Comparison ===\n');
console.log('1. JSX Syntax Test:');
const jsxResult = renderToString(_jsx(JSXTest, {}));
console.log('   Result:', jsxResult);
console.log('\n2. Direct jsx() Calls Test React 16:');
const directResult = renderToString(_jsx(DirectTest16, {}));
console.log('   Result:', directResult);
console.log('\n2. Direct jsx() Calls Test React 17:');
const directResult17 = renderToString(_jsx(DirectTest17, {}));
console.log('   Result:', directResult17);
console.log('\n=== Analysis ===');
console.log('JSX Result Empty:', jsxResult === '<DIV></DIV>');
console.log('Direct Result Has Children:', directResult.includes('<H1>') && directResult.includes('<H2>'));
export { JSXTest, DirectTest16 as DirectTest };
