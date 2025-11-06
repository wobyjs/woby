"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("woby/jsx-runtime");
// Test using JSX syntax
const ssr_1 = require("woby/ssr");
// Simple test component using JSX
const App = () => {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Simple Test" }), (0, jsx_runtime_1.jsxs)("div", { class: "test", children: [(0, jsx_runtime_1.jsx)("h2", { children: "Hello World" }), (0, jsx_runtime_1.jsx)("p", { children: "This is a simple test." })] })] }));
};
// Test the renderToString function
const result = (0, ssr_1.renderToString)((0, jsx_runtime_1.jsx)(App, {}));
console.log('Rendered HTML:');
console.log(result);
console.log('--- End of rendered HTML ---');
