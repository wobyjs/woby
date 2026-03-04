import { jsxs as _jsxs, jsx as _jsx } from "woby/jsx-runtime";
/* @jsxImportSource woby */
import { For, renderToString } from 'woby';
// Test case 1: Empty array with fallback
const TestEmptyWithFallback = () => {
    return (_jsx("div", { children: _jsx(For, { values: [], fallback: _jsx("p", { children: "Fallback Content" }), children: (value) => _jsxs("p", { children: ["Value: ", value] }) }) }));
};
// Test case 2: Non-empty array (should render values, not fallback)
const TestNonEmpty = () => {
    return (_jsx("div", { children: _jsx(For, { values: [1, 2, 3], fallback: _jsx("p", { children: "Fallback Content" }), children: (value) => _jsxs("p", { children: ["Value: ", value] }) }) }));
};
console.log('Test 1 - Empty array with fallback:');
console.log('SSR Result:', renderToString(_jsx(TestEmptyWithFallback, {})));
console.log('\nTest 2 - Non-empty array:');
console.log('SSR Result:', renderToString(_jsx(TestNonEmpty, {})));
