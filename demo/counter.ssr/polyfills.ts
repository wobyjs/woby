// Platform-specific polyfills for SSR and browser environments

// Ensure process.platform is defined
if (typeof process === 'undefined') {
    globalThis.process = { platform: 'win32' }
} else if (!process.platform) {
    process.platform = 'win32'
}

// Ensure other process properties that might be needed
if (process && !process.env) {
    process.env = {}
}

export {}