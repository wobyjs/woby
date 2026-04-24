import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const srcDir = 'D:/Developments/tslib/@woby/woby/demo/playground/src';

const files = [
  'TestClassesObjectStore.tsx',
  'TestClassesObjectStoreMultiple.tsx',
  'TestContextComponents.tsx',
  'TestContextDynamicContext.tsx',
  'TestContextHook.tsx',
  'TestHTMLDangerouslySetInnerHTMLObservable.tsx',
  'TestHTMLDangerouslySetInnerHTMLObservableString.tsx',
  'TestResourceFallbackLatest.tsx',
  'TestResourceFallbackValue.tsx',
];

for (const file of files) {
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

console.log('\nDone!');
