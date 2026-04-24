import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const srcDir = 'D:/Developments/tslib/@woby/woby/demo/playground/src';

// Convert the 4 Undefined files
const undefinedFiles = [
  'TestUndefinedFunction.tsx',
  'TestUndefinedObservable.tsx',
  'TestUndefinedRemoval.tsx',
  'TestUndefinedStatic.tsx',
];

for (const file of undefinedFiles) {
  const filePath = join(srcDir, file);
  let content = readFileSync(filePath, 'utf8');

  if (content.includes("if (typeof window === 'undefined') {") && content.includes("SSR tests")) {
    console.log(`⏭️  ${file} - already converted`);
    continue;
  }

  const nameMatch = content.match(/const name = '([^']+)'/);
  if (!nameMatch) {
    console.log(`❌ ${file} - no name found`);
    continue;
  }
  const componentName = nameMatch[1];

  const ssrBlock = `
// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    ${componentName}()
    const ssrComponent = testObservables[\`${componentName}_ssr\`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(\`\\n📝 Test: ${componentName}\\n   SSR: \${ssrResult} ✅\\n\`)
    }
}
`;

  const testPattern = new RegExp(`\n(${componentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.test = \\{)`);
  const testMatch = content.match(testPattern);

  if (!testMatch) {
    console.log(`❌ ${file} - no test block found`);
    continue;
  }

  const insertPos = content.indexOf(testMatch[1]);
  const newContent = content.slice(0, insertPos) + ssrBlock + '\n' + content.slice(insertPos);
  const cleanedContent = newContent.replace(/\n\/\/ console\.log\(renderToString\(.*\)\)\s*$/, '');

  writeFileSync(filePath, cleanedContent, 'utf8');
  console.log(`✅ ${file} - converted`);
}

// Convert TestTailwindNoImport.tsx (has 3 test components)
const tailwindFile = join(srcDir, 'TestTailwindNoImport.tsx');
let tailwindContent = readFileSync(tailwindFile, 'utf8');

// Add SSR blocks for each of the 3 test components
const tailwindTests = [
  { name: 'TestTailwindNoImportTSX', pattern: 'TestTailwindNoImportTSX.test = {' },
  { name: 'TestTailwindNoImportHTML', pattern: 'TestTailwindNoImportHTML.test = {' },
  { name: 'TestTailwindNoImportNested', pattern: 'TestTailwindNoImportNested.test = {' },
];

for (const test of tailwindTests) {
  const ssrBlock = `
// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    ${test.name}()
    const ssrComponent = testObservables[\`${test.name}_ssr\`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(\`\\n📝 Test: ${test.name}\\n   SSR: \${ssrResult} ✅\\n\`)
    }
}
`;

  const insertPos = tailwindContent.indexOf(test.pattern);
  if (insertPos === -1) {
    console.log(`❌ TestTailwindNoImport - no ${test.name} test block found`);
    continue;
  }
  
  tailwindContent = tailwindContent.slice(0, insertPos) + ssrBlock + '\n' + tailwindContent.slice(insertPos);
}

writeFileSync(tailwindFile, tailwindContent, 'utf8');
console.log(`✅ TestTailwindNoImport.tsx - converted`);

// Convert TestTailwindNoImportHTML.tsx
const tailwindHTMLFile = join(srcDir, 'TestTailwindNoImportHTML.tsx');
let tailwindHTMLContent = readFileSync(tailwindHTMLFile, 'utf8');

const tailwindHTMLTests = [
  { name: 'TestTailwindNoImportHTMLTSX', pattern: 'TestTailwindNoImportHTMLTSX.test = {' },
  { name: 'TestTailwindNoImportHTMLHTML', pattern: 'TestTailwindNoImportHTMLHTML.test = {' },
  { name: 'TestTailwindNoImportHTMLNested', pattern: 'TestTailwindNoImportHTMLNested.test = {' },
];

for (const test of tailwindHTMLTests) {
  const ssrBlock = `
// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    ${test.name}()
    const ssrComponent = testObservables[\`${test.name}_ssr\`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(\`\\n📝 Test: ${test.name}\\n   SSR: \${ssrResult} ✅\\n\`)
    }
}
`;

  const insertPos = tailwindHTMLContent.indexOf(test.pattern);
  if (insertPos === -1) {
    console.log(`❌ TestTailwindNoImportHTML - no ${test.name} test block found`);
    continue;
  }
  
  tailwindHTMLContent = tailwindHTMLContent.slice(0, insertPos) + ssrBlock + '\n' + tailwindHTMLContent.slice(insertPos);
}

writeFileSync(tailwindHTMLFile, tailwindHTMLContent, 'utf8');
console.log(`✅ TestTailwindNoImportHTML.tsx - converted`);

// Convert TestTailwindWithImport.tsx
const tailwindImportFile = join(srcDir, 'TestTailwindWithImport.tsx');
let tailwindImportContent = readFileSync(tailwindImportFile, 'utf8');

const tailwindImportTests = [
  { name: 'TestTailwindWithImportTSX', pattern: 'TestTailwindWithImportTSX.test = {' },
  { name: 'TestTailwindWithImportHTML', pattern: 'TestTailwindWithImportHTML.test = {' },
  { name: 'TestTailwindWithImportNested', pattern: 'TestTailwindWithImportNested.test = {' },
];

for (const test of tailwindImportTests) {
  const ssrBlock = `
// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    ${test.name}()
    const ssrComponent = testObservables[\`${test.name}_ssr\`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(\`\\n📝 Test: ${test.name}\\n   SSR: \${ssrResult} ✅\\n\`)
    }
}
`;

  const insertPos = tailwindImportContent.indexOf(test.pattern);
  if (insertPos === -1) {
    console.log(`❌ TestTailwindWithImport - no ${test.name} test block found`);
    continue;
  }
  
  tailwindImportContent = tailwindImportContent.slice(0, insertPos) + ssrBlock + '\n' + tailwindImportContent.slice(insertPos);
}

writeFileSync(tailwindImportFile, tailwindImportContent, 'utf8');
console.log(`✅ TestTailwindWithImport.tsx - converted`);

// Convert TestTailwindWithImportHTML.tsx
const tailwindImportHTMLFile = join(srcDir, 'TestTailwindWithImportHTML.tsx');
let tailwindImportHTMLContent = readFileSync(tailwindImportHTMLFile, 'utf8');

const tailwindImportHTMLTests = [
  { name: 'TestTailwindWithImportHTMLTSX', pattern: 'TestTailwindWithImportHTMLTSX.test = {' },
  { name: 'TestTailwindWithImportHTMLHTML', pattern: 'TestTailwindWithImportHTMLHTML.test = {' },
  { name: 'TestTailwindWithImportHTMLNested', pattern: 'TestTailwindWithImportHTMLHTMLNested.test = {' },
];

for (const test of tailwindImportHTMLTests) {
  const ssrBlock = `
// Conditional: SSR tests (Node.js environment - tsx mode)
if (typeof window === 'undefined') {
    ${test.name}()
    const ssrComponent = testObservables[\`${test.name}_ssr\`]
    if (ssrComponent) {
        const ssrResult = renderToString(ssrComponent)
        console.log(\`\\n📝 Test: ${test.name}\\n   SSR: \${ssrResult} ✅\\n\`)
    }
}
`;

  const insertPos = tailwindImportHTMLContent.indexOf(test.pattern);
  if (insertPos === -1) {
    console.log(`❌ TestTailwindWithImportHTML - no ${test.name} test block found`);
    continue;
  }
  
  tailwindImportHTMLContent = tailwindImportHTMLContent.slice(0, insertPos) + ssrBlock + '\n' + tailwindImportHTMLContent.slice(insertPos);
}

writeFileSync(tailwindImportHTMLFile, tailwindImportHTMLContent, 'utf8');
console.log(`✅ TestTailwindWithImportHTML.tsx - converted`);

console.log('\nDone!');
