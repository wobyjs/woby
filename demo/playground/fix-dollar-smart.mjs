import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dir = path.join(__dirname, 'test.playground/test.playwright');

// Files that still need $$ added or checked
const filesToCheck = [
    'TestStyleFunction.spec.tsx',
    'TestStyleFunctionNumeric.spec.tsx',
    'TestStyleObservable.spec.tsx',
    'TestStyleRemoval.spec.tsx',
    'TestStylesRemoval.spec.tsx',
    'TestStyleFunctionString.spec.tsx',
    'TestStyleFunctionVariable.spec.tsx'
];

let fixedCount = 0;

filesToCheck.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if file has $$ in code but not in the destructuring line
    const hasDollarInCode = /\$\$\(/.test(content);
    const destructuringLine = content.match(/const \{ [^}]+woby\}/)?.[0];

    if (hasDollarInCode) {
        // Check if $$ is in destructuring
        if (!destructuringLine || !destructuringLine.includes('$$')) {
            // Get all variable names from destructuring
            const vars = content.match(/const \{ ([^}]+) \}.*woby/)?.[1] || '';
            // Split the vars and add $$ if not present
            const varsArray = vars.split(',').map(v => v.trim());
            const hasDollarDestructured = varsArray.some(v => v.trim() === '$$');

            if (!hasDollarDestructured) {
                // Add $$ to destructuring
                const prefix = destructuringLine ? destructuringLine.replace('}', '') : 'const { ';
                const newLine = `${prefix}\$\$, `;
                content = content.replace(
                    /const \{ [^}]+ \} = woby/,
                    newLine
                );
                fs.writeFileSync(filePath, content, 'utf8');
                fixedCount++;
                console.log(`Fixed: ${file}`);
            } else {
                console.log(`Skipped: ${file} - already has $$ in destructuring`);
            }
        } else {
            console.log(`Skipped: ${file} - no $$ in code`);
        }
    }
});

console.log(`Total fixed: ${fixedCount}`);
