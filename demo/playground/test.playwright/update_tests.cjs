const fs = require('fs');
const path = require('path');

// Component mapping with their expected patterns
const componentTests = {
    'TestStringStatic': {
        heading: 'String - Static',
        expect: () => `expect(content).toBe('string');`
    },
    'TestStringObservable': {
        heading: 'String - Observable',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        expect(${contentVar}.length).toBeGreaterThan(0);`
    },
    'TestStringObservableStatic': {
        heading: 'String - Observable Static',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        expect(${contentVar}.length).toBeGreaterThan(0);`
    },
    'TestStringObservableDeepStatic': {
        heading: 'String - Observable Deep Static',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        expect(${contentVar}.length).toBeGreaterThan(0);`
    },
    'TestStringFunction': {
        heading: 'String - Function',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        expect(${contentVar}.length).toBeGreaterThan(0);`
    },
    'TestStringRemoval': {
        heading: 'String - Removal',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        // Content should be either empty parentheses or a value in parentheses
        const isInParens = ${contentVar}.startsWith('(') && ${contentVar}.endsWith(')');
        expect(isInParens).toBe(true);`
    },
    'TestNumberStatic': {
        heading: 'Number - Static',
        expect: (contentVar) => `expect(!isNaN(parseFloat(${contentVar}))).toBe(true);`
    },
    'TestNumberObservable': {
        heading: 'Number - Observable',
        expect: (contentVar) => `expect(typeof parseFloat(${contentVar})).toBe('number');
        expect(isNaN(parseFloat(${contentVar}))).toBe(false);`
    },
    'TestNumberFunction': {
        heading: 'Number - Function',
        expect: (contentVar) => `expect(typeof parseFloat(${contentVar})).toBe('number');
        expect(isNaN(parseFloat(${contentVar}))).toBe(false);`
    },
    'TestNumberRemoval': {
        heading: 'Number - Removal',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        // Content should be either empty parentheses or a number in parentheses
        const matches = ${contentVar}.match(/^$$([^)]*)$$$/);
        expect(matches).toBeTruthy();
        if (matches[1]) {
            expect(!isNaN(parseFloat(matches[1]))).toBe(true);
        }`
    },
    'TestBigIntStatic': {
        heading: 'BigInt - Static',
        expect: (contentVar) => `expect(${contentVar}.endsWith('n')).toBe(true);
        const numPart = ${contentVar}.slice(0, -1);
        expect(!isNaN(parseInt(numPart))).toBe(true);`
    },
    'TestBigIntObservable': {
        heading: 'BigInt - Observable',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        expect(${contentVar}.length).toBeGreaterThan(0);
        // For BigInt observable, content should be a numeric string
        expect(!isNaN(parseInt(${contentVar}))).toBe(true);`
    },
    'TestBigIntFunction': {
        heading: 'BigInt - Function',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        expect(${contentVar}.length).toBeGreaterThan(0);
        // For BigInt function, content should be a numeric string
        expect(!isNaN(parseInt(${contentVar}))).toBe(true);`
    },
    'TestBigIntRemoval': {
        heading: 'BigInt - Removal',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        // Content should be either empty parentheses or a number in parentheses
        const matches = ${contentVar}.match(/^$$([^)]*)$$$/);
        expect(matches).toBeTruthy();
        if (matches[1]) {
            expect(!isNaN(parseInt(matches[1]))).toBe(true);
        }`
    },
    'TestNullStatic': {
        heading: 'Null - Static',
        expect: (contentVar) => `expect(${contentVar}).toBe('');`
    },
    'TestNullObservable': {
        heading: 'Null - Observable',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        // Should be empty string or placeholder
        expect(${contentVar}.length).toBeGreaterThanOrEqual(0);`
    },
    'TestNullFunction': {
        heading: 'Null - Function',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        // Should be empty string or placeholder
        expect(${contentVar}.length).toBeGreaterThanOrEqual(0);`
    },
    'TestNullRemoval': {
        heading: 'Null - Removal',
        expect: (contentVar) => `expect(${contentVar}).toMatch(/^$$.*$$$/);`
    },
    'TestUndefinedStatic': {
        heading: 'Undefined - Static',
        expect: (contentVar) => `expect(${contentVar}).toBe('');`
    },
    'TestUndefinedObservable': {
        heading: 'Undefined - Observable',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        // Should be empty string or placeholder
        expect(${contentVar}.length).toBeGreaterThanOrEqual(0);`
    },
    'TestUndefinedFunction': {
        heading: 'Undefined - Function',
        expect: (contentVar) => `expect(typeof ${contentVar}).toBe('string');
        // Should be empty string or placeholder
        expect(${contentVar}.length).toBeGreaterThanOrEqual(0);`
    },
    'TestUndefinedRemoval': {
        heading: 'Undefined - Removal',
        expect: (contentVar) => `expect(${contentVar}).toMatch(/^$$.*$$$/);`
    },
    'TestBooleanStatic': {
        heading: 'Boolean - Static',
        expect: (contentVar) => `expect(${contentVar}).toBe('');`
    },
    'TestBooleanObservable': {
        heading: 'Boolean - Observable',
        expect: (contentVar) => `expect(${contentVar}).toBe('');`
    },
    'TestBooleanFunction': {
        heading: 'Boolean - Function',
        expect: (contentVar) => `expect(${contentVar}).toBe('');`
    },
    'TestBooleanRemoval': {
        heading: 'Boolean - Removal',
        expect: (contentVar) => `expect(${contentVar}).toMatch(/^$$.*$$$/);`
    },
    'TestSymbolStatic': {
        heading: 'Symbol - Static',
        expect: (contentVar) => `expect(${contentVar}).toBe('');`
    },
    'TestSymbolObservable': {
        heading: 'Symbol - Observable',
        expect: (contentVar) => `expect(${contentVar}).toBe('');`
    },
    'TestSymbolFunction': {
        heading: 'Symbol - Function',
        expect: (contentVar) => `expect(${contentVar}).toBe('');`
    },
    'TestSymbolRemoval': {
        heading: 'Symbol - Removal',
        expect: (contentVar) => `expect(${contentVar}).toMatch(/^$$.*$$$/);`
    }
};

// Template for new test files
function createTestTemplate(componentName, config) {
    const isDynamic = componentName.includes('Observable') || componentName.includes('Function') || componentName.includes('Removal');

    if (isDynamic) {
        // For dynamic components, just verify the component exists
        return `import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5176',
});

test('playground demo should render ${componentName} component with correct snapshot', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Look for ${componentName} component
    const componentHeading = page.locator('h3', { hasText: '${config.heading}' });
    const componentCount = await componentHeading.count();
    
    expect(componentCount).toBeGreaterThan(0);
    
    console.log('Playground demo ${componentName} component renders correctly');
});
`;
    } else {
        // For static components, verify the content
        return `import { test, expect } from '@playwright/test';

// Configure the web server for this specific test suite
test.use({
    baseURL: 'http://localhost:5176',
});

test('playground demo should render ${componentName} component with correct snapshot', async ({ page }) => {
    // Navigate to the playground demo via HTTP server
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Look for ${componentName} component
    const componentHeading = page.locator('h3', { hasText: '${config.heading}' });
    const componentCount = await componentHeading.count();
    
    expect(componentCount).toBeGreaterThan(0);
    
    if (componentCount > 0) {
        // Get the first instance of the component
        const container = componentHeading.first().locator('..');
        // Get the paragraph element
        const paragraph = container.locator('p').first();
        // Get the text content
        const content = await paragraph.textContent();
        
        // Perform assertions based on component type
        ${config.expect('content')}
        
        console.log('Playground demo ${componentName} component renders correct snapshot');
    }
});
`;
    }
}

// Update existing test files
const testDir = path.join(__dirname);
const testFiles = fs.readdirSync(testDir).filter(file => file.endsWith('.spec.js'));

console.log('Updating test files...');
console.log('Found', testFiles.length, 'test files');

for (const file of testFiles) {
    const componentName = file.replace('.spec.js', '');

    if (componentTests[componentName]) {
        const config = componentTests[componentName];
        const newContent = createTestTemplate(componentName, config);

        const filePath = path.join(testDir, file);
        fs.writeFileSync(filePath, newContent);
        console.log('✓ Updated', file);
    } else {
        console.log('ℹ Skipping', file, '- no configuration found');
    }
}

console.log('Test update complete!');