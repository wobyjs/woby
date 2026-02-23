#!/usr/bin/env node

/**
 * Simple test runner for TestClassesObjectRemoval and TestDynamicStoreProps
 * Captures console output and analyzes test results
 */

import { spawn } from 'child_process';
import { join } from 'path';
import fs from 'fs';

async function runComponentTest(componentName) {
    console.log(`\n🚀 Testing ${componentName}...`);
    console.log('-'.repeat(40));
    
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        const testProcess = spawn('npx', [
            'playwright',
            'test',
            `test.playwright/${componentName}.spec.tsx`,
            '--config=playwright.direct.config.ts',
            '--reporter=list'
        ], {
            cwd: process.cwd(),
            stdio: 'pipe'
        });

        let output = '';
        let errorOutput = '';
        
        testProcess.stdout.on('data', (data) => {
            const chunk = data.toString();
            output += chunk;
            process.stdout.write(chunk);
        });
        
        testProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        testProcess.on('close', (code) => {
            const duration = Date.now() - startTime;
            const passed = code === 0;
            
            console.log(`\n⏱️  Duration: ${duration}ms`);
            console.log(`📊 Result: ${passed ? '✅ PASSED' : '❌ FAILED'} (exit code: ${code})`);
            
            resolve({
                component: componentName,
                passed,
                exitCode: code,
                duration,
                output,
                errorOutput
            });
        });
    });
}

async function captureDetailedLogs() {
    console.log('\n🔍 Capturing detailed console logs...');
    
    // Start dev server if not running
    const devProcess = spawn('pnpm', ['dev'], {
        cwd: process.cwd(),
        stdio: 'ignore'
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Run tests and capture browser console
    const testProcess = spawn('npx', [
        'playwright',
        'test',
        'test.playwright/TestClassesObjectRemoval.spec.tsx',
        'test.playwright/TestDynamicStoreProps.spec.tsx',
        '--config=playwright.direct.config.ts',
        '--headed'
    ], {
        cwd: process.cwd(),
        stdio: 'pipe'
    });
    
    let fullOutput = '';
    
    testProcess.stdout.on('data', (data) => {
        fullOutput += data.toString();
    });
    
    testProcess.stderr.on('data', (data) => {
        fullOutput += data.toString();
    });
    
    // Run for 15 seconds to capture logs
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Kill processes
    testProcess.kill();
    devProcess.kill();
    
    return fullOutput;
}

async function analyzeLogs(logs) {
    console.log('\n🔍 Analyzing test logs...');
    
    const lines = logs.split('\n');
    
    // Find assertion failures
    const assertionFailures = lines.filter(line => 
        line.includes('assert') && 
        (line.includes('Expected') || line.includes('SSR mismatch'))
    );
    
    // Find successful tests
    const successfulTests = lines.filter(line => 
        line.includes('✅ Expect function test passed') ||
        line.includes('✅ SSR test passed') ||
        line.includes('PASS')
    );
    
    // Find component-specific logs
    const componentLogs = {
        TestClassesObjectRemoval: lines.filter(line => 
            line.includes('[TestClassesObjectRemoval]')
        ),
        TestDynamicStoreProps: lines.filter(line => 
            line.includes('[TestDynamicStoreProps]')
        )
    };
    
    return {
        assertionFailures,
        successfulTests,
        componentLogs,
        totalLines: lines.length
    };
}

async function main() {
    console.log('🧪 Woby Component Test Runner');
    console.log('Components: TestClassesObjectRemoval, TestDynamicStoreProps');
    console.log(new Date().toISOString());
    console.log('=' .repeat(50));
    
    const components = [
        'TestClassesObjectRemoval',
        'TestDynamicStoreProps'
    ];
    
    const results = [];
    
    // Test each component
    for (const component of components) {
        const result = await runComponentTest(component);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Capture detailed logs
    const detailedLogs = await captureDetailedLogs();
    const logAnalysis = await analyzeLogs(detailedLogs);
    
    // Save logs
    const logFile = 'component-test-logs.txt';
    fs.writeFileSync(logFile, detailedLogs);
    console.log(`\n💾 Logs saved to: ${logFile}`);
    
    // Generate report
    console.log('\n' + '=' .repeat(50));
    console.log('📋 TEST RESULTS SUMMARY');
    console.log('=' .repeat(50));
    
    let passedCount = 0;
    let failedCount = 0;
    
    results.forEach((result, index) => {
        const status = result.passed ? '✅ PASSED' : '❌ FAILED';
        console.log(`${index + 1}. ${result.component}: ${status} (${result.duration}ms)`);
        if (result.passed) passedCount++; else failedCount++;
    });
    
    console.log('-' .repeat(50));
    console.log(`📊 Summary: ${passedCount} passed, ${failedCount} failed`);
    console.log(`🎯 Success Rate: ${((passedCount / results.length) * 100).toFixed(1)}%`);
    
    // Show log analysis
    console.log('\n🔍 LOG ANALYSIS:');
    console.log(`Total log lines: ${logAnalysis.totalLines}`);
    console.log(`Successful test assertions: ${logAnalysis.successfulTests.length}`);
    console.log(`Assertion failures: ${logAnalysis.assertionFailures.length}`);
    
    if (logAnalysis.assertionFailures.length > 0) {
        console.log('\n❌ ASSERTION FAILURES:');
        logAnalysis.assertionFailures.forEach((failure, index) => {
            console.log(`${index + 1}. ${failure.trim()}`);
        });
    }
    
    // Show component-specific logs
    Object.entries(logAnalysis.componentLogs).forEach(([component, logs]) => {
        if (logs.length > 0) {
            console.log(`\n📝 ${component} Logs (${logs.length} entries):`);
            logs.slice(0, 5).forEach(log => {
                console.log(`   ${log.trim()}`);
            });
            if (logs.length > 5) {
                console.log(`   ... and ${logs.length - 5} more entries`);
            }
        }
    });
    
    console.log('\n🏁 Test execution completed!');
    process.exit(failedCount > 0 ? 1 : 0);
}

// Run the test
main().catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
});