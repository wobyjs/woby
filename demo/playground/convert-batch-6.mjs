import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const srcDir = 'D:/Developments/tslib/@woby/woby/demo/playground/src';

const files = [
  'TestDirective.tsx',
  'TestDirectiveRef.tsx',
  'TestDirectiveRegisterLocal.tsx',
  'TestDirectiveSingleArgument.tsx',
  'TestDynamicFunctionComponent.tsx',
  'TestDynamicFunctionProps.tsx',
  'TestDynamicHeading.tsx',
  'TestDynamicObservableChildren.tsx',
  'TestDynamicObservableComponent.tsx',
  'TestDynamicObservableProps.tsx',
  'TestDynamicStoreProps.tsx',
  'TestErrorBoundary.tsx',
  'TestErrorBoundaryChildrenFunction.tsx',
  'TestErrorBoundaryChildrenObservableStatic.tsx',
  'TestErrorBoundaryFallback.tsx',
  'TestErrorBoundaryFallbackFunction.tsx',
  'TestErrorBoundaryFallbackObservableStatic.tsx',
  'TestErrorBoundaryNoError.tsx',
  'TestEventClickAndClickCaptureStatic.tsx',
  'TestEventClickCaptureObservable.tsx',
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

  // Find the pattern: ComponentName.test = {
  // We need to insert the SSR block before this line
  
  // Determine the component function name (same as name for most files)
  // For most files it's ComponentName() that needs to be called
  
  // Check if there's already a trailing comment with renderToString
  const hasTrailingComment = content.includes('// console.log(renderToString(');
  
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
  const testPattern = new RegExp(`\n(${componentName}\\.test = \\{)`);
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
