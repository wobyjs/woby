import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

const testName = process.argv[2] || 'TestDynamicObservableChildren';
const testProcess = spawn(`npx playwright test --config=playwright.direct.config.ts "test.playground/test.playwright/${testName}*.spec.tsx"`, {
  cwd: 'd:\\temp\\woby\\demo\\playground',
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true
});

let output = '';

testProcess.stdout.on('data', (data) => {
  output += data.toString();
  console.log(data.toString());
});

testProcess.stderr.on('data', (data) => {
  output += data.toString();
  console.error(data.toString());
});

testProcess.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  writeFileSync('test_result.txt', output);
});