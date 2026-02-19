const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'test.playground', 'test.playwright');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.spec.tsx'));

console.log(`Found ${files.length} spec files to update`);

files.forEach(file => {
    const filePath = path.join(testDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the old path with the new path
    const oldPath = '../../../dist/index.umd.js';
    const newPath = '../../../../dist/index.umd.js';

    if (content.includes(oldPath)) {
        content = content.replace(oldPath, newPath);
        fs.writeFileSync(filePath, content);
        console.log(`Updated path in ${file}`);
    }
});

console.log('Path update complete!');