/**
 * Stylesheet utility functions for the Woby framework
 * 
 * This module provides utility functions for working with stylesheets in the browser,
 * including converting document stylesheets to constructed stylesheets with caching
 * and observing stylesheet changes.
 * 
 * @module stylesheetUtils
 */

// Cache for converted stylesheets
let cachedConstructedSheets: CSSStyleSheet[] | null = null
let stylesheetObserver: MutationObserver | null = null

/**
 * Converts all document stylesheets to constructed stylesheets with caching
 * 
 * This function converts all stylesheets in the document to CSSStyleSheet objects
 * that can be used in shadow DOM. It caches the results for performance and
 * automatically invalidates the cache when stylesheets change.
 * 
 * @returns Array of CSSStyleSheet objects representing all stylesheets in the document
 * 
 * @example
 * ```typescript
 * const stylesheets = convertAllDocumentStylesToConstructed()
 * shadowRoot.adoptedStyleSheets = stylesheets
 * ```
 */
export function convertAllDocumentStylesToConstructed(): CSSStyleSheet[] {
    // Return cached result if available
    if (cachedConstructedSheets) {
        return cachedConstructedSheets
    }

    const constructedSheets: CSSStyleSheet[] = []
    // Use traditional for loop to avoid TypeScript issues with StyleSheetList iteration
    // StyleSheetList doesn't always have proper iterator support in all environments
    for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i]
        try {
            const newSheet = new CSSStyleSheet()
            let allRules = ''
            for (let j = 0; j < sheet.cssRules.length; j++) {
                const rule = sheet.cssRules[j]
                allRules += rule.cssText
            }
            newSheet.replaceSync(allRules)
            constructedSheets.push(newSheet)
        } catch (e) {
            // This will catch any stylesheets that are cross-origin or
            // have other access restrictions.
            console.warn("Could not copy stylesheet:", e)
        }
    }

    // Cache the result
    cachedConstructedSheets = constructedSheets
    return constructedSheets
}

/**
 * Initializes stylesheet observation to automatically invalidate cache when stylesheets change
 * 
 * This function sets up a MutationObserver to watch for changes to the document that
 * might affect stylesheets. When changes are detected, the stylesheet cache is cleared
 * to ensure styles are up-to-date.
 * 
 * @example
 * ```typescript
 * observeStylesheetChanges()
 * const stylesheets = convertAllDocumentStylesToConstructed() // Will be cached
 * // When stylesheets change, cache is automatically cleared
 * ```
 */
export function observeStylesheetChanges(): void {
    if (stylesheetObserver) {
        return // Already observing
    }

    stylesheetObserver = new MutationObserver(() => {
        // Clear cache when stylesheets change
        cachedConstructedSheets = null
    })

    // Observe changes to the document head where stylesheets are typically added/removed
    stylesheetObserver.observe(document.head, {
        childList: true,
        subtree: true
    })

    // Also observe the document for style/link elements
    stylesheetObserver.observe(document, {
        childList: true,
        subtree: true
    })
}

/**
 * Stops observing stylesheet changes and cleans up resources
 * 
 * This function disconnects the MutationObserver and clears the stylesheet cache.
 * It should be called when the functionality is no longer needed to prevent memory leaks.
 * 
 * @example
 * ```typescript
 * unobserveStylesheetChanges() // Clean up resources
 * ```
 */
export function unobserveStylesheetChanges(): void {
    if (stylesheetObserver) {
        stylesheetObserver.disconnect()
        stylesheetObserver = null
    }
    cachedConstructedSheets = null
}