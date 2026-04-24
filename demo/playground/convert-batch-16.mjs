import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const srcDir = 'D:/Developments/tslib/@woby/woby/demo/playground/src';

const files = [
  'TestSwitchObservable.tsx',
  'TestSwitchObservableComplex.tsx',
  'TestSwitchStatic.tsx',
  'TestSymbolAttribute.tsx',
  'TestSymbolFunction.tsx',
  'TestSymbolObservable.tsx',
  'TestSymbolRemoval.tsx',
  'TestSymbolStatic.tsx',
  'TestTabIndexBooleanFunction.tsx',
  'TestTabIndexBooleanObservable.tsx',
  'TestTabIndexBooleanStatic.tsx',
  'TestTailwindNoImport.tsx',
  'TestTailwindNoImportHTML.tsx',
  'TestTailwindWithImport.tsx',
  'TestTailwindWithImportHTML.tsx',
  'TestTemplateExternal.tsx',
  'TestTemplateSVG.tsx',
  'TestTernaryChildrenFunction.tsx',
  'TestTernaryChildrenObservableStatic.tsx',
  'TestTernaryFunction.tsx',
];

for (const file of files) {
  const filePath = join(srcDir, file);
  let content = readFileSync(filePath, 'utf8');

  // Skip if already has the tsx SSR block
  if (content.includes("if (typeof window === 'undefined') {") && content.includes("SSR tests")) {
    console.log(`⏭️  ${file} - already converted`);
    continue;
  }

  // Extract the component name from "const name = '...'"
  const nameMatch = content.match(/const name = '([^']+)'/);
  if (!nameMatch) {
    console.log(`❌ ${file} - no name found`);
    continue;
  }
  const componentName = nameMatch[1];

  // Build the SSR block
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

  // Find the position to insert - before "ComponentName.test = {"
  const testPattern = new RegExp(`\n(${componentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.test = \\{)`);
  const testMatch = content.match(testPattern);

  if (!testMatch) {
    console.log(`❌ ${file} - no test block found`);
    continue;
  }

  // Insert the SSR block before the test block
  const insertPos = content.indexOf(testMatch[1]);
  const newContent = content.slice(0, insertPos) + ssrBlock + '\n' + content.slice(insertPos);

  // Remove trailing renderToString comment if present
  const cleanedContent = newContent.replace(/\n\/\/ console\.log\(renderToString\(.*\)\)\s*$/, '');

  writeFileSync(filePath, cleanedContent, 'utf8');
  console.log(`✅ ${file} - converted`);
}

console.log('\nDone!');
