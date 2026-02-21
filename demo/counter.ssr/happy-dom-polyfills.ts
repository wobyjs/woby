// Happy DOM / SSR polyfills
// This file should be imported before any other code that might depend on process.platform

// Ensure process exists and has platform property
if (typeof globalThis !== 'undefined') {
  // Browser/Happy DOM environment
  if (!globalThis.process) {
    globalThis.process = { platform: 'win32' };
  } else if (!globalThis.process.platform) {
    globalThis.process.platform = 'win32';
  }
} else if (typeof process !== 'undefined') {
  // Node.js environment
  if (!process.platform) {
    process.platform = 'win32';
  }
}

// Ensure process.env exists
if (typeof globalThis !== 'undefined' && globalThis.process && !globalThis.process.env) {
  globalThis.process.env = {};
} else if (typeof process !== 'undefined' && !process.env) {
  process.env = {};
}

export {};