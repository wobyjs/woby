/**
 * Standalone SSR Test for Environment Setup
 * 
 * This test verifies that the SSR environment is correctly set up for custom elements.
 */

// Simple test to verify our SSR environment
const testSSREnvironment = () => {
    // Check if we're in SSR mode (no window/document)
    const isSSR = typeof window === 'undefined' || typeof document === 'undefined'

    console.log('SSR Mode:', isSSR)

    if (isSSR) {
        // Test that the environment is correctly set up for SSR
        console.log('✅ SSR environment detected')

        // Test that customElements is not defined (as expected in SSR)
        if (typeof customElements === 'undefined') {
            console.log('✅ customElements API correctly undefined in SSR')
            return true
        } else {
            console.log('❌ customElements API unexpectedly available in SSR')
            return false
        }
    }

    console.log('Not in SSR mode')
    return false
}

// Run the test
const result = testSSREnvironment()
if (result) {
    console.log('SSR environment is correctly set up!')
} else {
    console.log('SSR environment needs fixes.')
}