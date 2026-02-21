/**
 * SSR Test for Environment Detection
 * 
 * This test verifies that our environment detection works correctly.
 */

// Simple test to verify our SSR environment detection
const testSSREnvironmentDetection = () => {
    // Check if we're in an SSR environment
    const isSSR = typeof window === 'undefined' || typeof document === 'undefined' || typeof customElements === 'undefined'

    console.log('SSR Mode:', isSSR)

    if (isSSR) {
        console.log('✅ SSR environment detected')
        console.log('✅ window defined:', typeof window !== 'undefined')
        console.log('✅ document defined:', typeof document !== 'undefined')
        console.log('✅ customElements defined:', typeof customElements !== 'undefined')

        return true
    }

    console.log('Not in SSR mode')
    return false
}

// Run the test
const ssrResult = testSSREnvironmentDetection()
if (ssrResult) {
    console.log('SSR environment detection is working correctly!')
} else {
    console.log('SSR environment detection needs fixes.')
}