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
const loggedErrors: Record<string, boolean> = {} // Track logged errors by call stack

// Registry of shadow roots that need style updates
const shadowRootRegistry = new Set<ShadowRoot>()

/**
 * Extracts @property rules from CSS text and converts them to :host variables
 * 
 * This is needed for Tailwind CSS v4 compatibility with Shadow DOM.
 * Shadow DOM doesn't support @property rules (CSS Houdini), so we extract
 * them and convert to regular CSS custom properties on :host.
 * 
 * @param cssText - The CSS text to process
 * @returns Object containing cleaned CSS (without @property rules) and extracted host variables
 */
function extractPropertyRules(cssText: string): { cleanedCSS: string; hostVariables: string[] } {
    const hostVariables: string[] = []
    
    // Match @property rules with their content
    // Pattern: @property --name { ... }
    const propertyRegex = /@property\s+([\w-]+)\s*\{([^}]*)\}/g
    let match
    
    while ((match = propertyRegex.exec(cssText)) !== null) {
        const propertyName = match[1]
        const propertyBody = match[2]
        
        // Extract initial-value if present
        const initialValueMatch = /initial-value:\s*([^;]+)/.exec(propertyBody)
        if (initialValueMatch) {
            const initialValue = initialValueMatch[1].trim()
            hostVariables.push(`${propertyName}: ${initialValue}`)
        }
    }
    
    // Remove all @property rules from the CSS text
    const cleanedCSS = cssText.replace(propertyRegex, '')
    
    return { cleanedCSS, hostVariables }
}

/**
 * Converts all document stylesheets to constructed stylesheets with caching
 * 
 * This function converts all stylesheets in the document to CSSStyleSheet objects
 * that can be used in shadow DOM. It caches the results for performance and
 * automatically invalidates the cache when stylesheets change.
 * 
 * IMPORTANT: If called before stylesheets have fully loaded, will return empty results.
 * Use refreshStylesheetCache() after page load to ensure all styles are captured.
 * 
 * TAILWIND CSS V4 COMPATIBILITY:
 * - Extracts @property rules and applies them as :host variables for Shadow DOM compatibility
 * - Shadow DOM doesn't support @property rules (CSS Houdini), so we convert them to regular CSS variables
 * - See: https://meefik.dev/2025/03/19/tailwindcss-and-shadow-dom/
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
    const propertyRules: string[] = [] // Collect @property rules to apply as :host variables
    
    // Method 1: Try to get styles from <style> tags (works for inline/Tailwind CDN)
    const styleElements = document.querySelectorAll('style')
    
    styleElements.forEach((styleEl) => {
        try {
            let cssText = styleEl.textContent || ''
            if (cssText.trim()) {
                // Extract @property rules and convert them to :host variables for Shadow DOM compatibility
                const { cleanedCSS, hostVariables } = extractPropertyRules(cssText)
                cssText = cleanedCSS
                if (hostVariables.length > 0) {
                    propertyRules.push(...hostVariables)
                }
                
                const newSheet = new CSSStyleSheet()
                newSheet.replaceSync(cssText)
                constructedSheets.push(newSheet)
            }
        } catch (e) {
            console.warn("Could not copy <style> element:", e)
        }
    })
    
    // Method 2: Copy from document.styleSheets (works for linked stylesheets)
    // Use traditional for loop to avoid TypeScript issues with StyleSheetList iteration
    // StyleSheetList doesn't always have proper iterator support in all environments
    for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i]
        
        try {
            // Cross-origin check — will throw on access if inaccessible
            if (sheet.href && new URL(sheet.href, window.location.href).origin !== window.location.origin) {
                continue
            }
            
            const newSheet = new CSSStyleSheet()
            let allRules = ''
            const cssRules = sheet.cssRules
            for (let j = 0; j < cssRules.length; j++) {
                const rule = cssRules[j]

                // Handle @property rules specially for Shadow DOM compatibility
                if (rule instanceof CSSPropertyRule) {
                    // Extract @property rules to apply as :host variables later
                    if (rule.initialValue) {
                        propertyRules.push(`${rule.name}: ${rule.initialValue}`)
                    }
                } else {
                    allRules += rule.cssText
                }
            }
            if (allRules.trim()) {
                newSheet.replaceSync(allRules)
                constructedSheets.push(newSheet)
            }
        } catch (e) {
            // Only log once per unique call stack to avoid spam
            const stack = new Error().stack
            const stackKey = stack?.split('\n').slice(2, 5).join('|').trim() || ''
            const cacheKey = `security_error_${stackKey}`
            if (!(cacheKey in loggedErrors)) {
                loggedErrors[cacheKey] = true
                console.warn("Could not copy stylesheet: SecurityError - Cannot access rules (likely cross-origin)")
            }
        }
    }

    // If we collected @property rules, create a stylesheet with :host variables
    // This makes the custom properties available inside Shadow DOM
    if (propertyRules.length > 0) {
        try {
            const propertySheet = new CSSStyleSheet()
            const hostRule = `:host { ${propertyRules.join('; ')} }`
            propertySheet.replaceSync(hostRule)
            constructedSheets.unshift(propertySheet) // Add first so it has priority
        } catch (e) {
            console.warn("Could not create @property fallback stylesheet:", e)
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
        
        // Update all registered shadow roots with new styles
        updateAllShadowRoots()
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
    shadowRootRegistry.clear()
}

/**
 * Registers a shadow root for automatic style updates
 * 
 * When stylesheets change, all registered shadow roots will have their
 * adoptedStyleSheets updated with the latest styles.
 * 
 * @param shadowRoot - The shadow root to register
 */
export function registerShadowRoot(shadowRoot: ShadowRoot): void {
    shadowRootRegistry.add(shadowRoot)
}

/**
 * Unregisters a shadow root from automatic style updates
 * 
 * @param shadowRoot - The shadow root to unregister
 */
export function unregisterShadowRoot(shadowRoot: ShadowRoot): void {
    shadowRootRegistry.delete(shadowRoot)
}

/**
 * Updates all registered shadow roots with the latest stylesheets
 * 
 * This is called automatically when stylesheet changes are detected,
 * but can also be called manually if needed.
 */
export function updateAllShadowRoots(): void {
    const allSheets = refreshStylesheetCache()
    
    if (allSheets.length === 0) return
    
    shadowRootRegistry.forEach(shadowRoot => {
        try {
            shadowRoot.adoptedStyleSheets = allSheets
        } catch (e) {
            console.warn('[StylesheetUtils] Failed to update shadow root:', e)
        }
    })
}

/**
 * Gets all inline styles from <style> tags as a single text string
 * 
 * This function collects all CSS text from <style> elements in the document.
 * It's useful for injecting styles into shadow DOM where adoptedStyleSheets
 * might not work or as a fallback/complement to adoptedStyleSheets.
 * 
 * @returns A string containing all inline CSS from the document
 * 
 * @example
 * ```typescript
 * const stylesText = getAllInlineStylesAsText()
 * const styleEl = document.createElement('style')
 * styleEl.textContent = stylesText
 * shadowRoot.appendChild(styleEl)
 * ```
 */
export function getAllInlineStylesAsText(): string {
    const styleElements = document.querySelectorAll('style')
    let allStyles = ''
    
    styleElements.forEach((styleEl) => {
        const cssText = styleEl.textContent || ''
        if (cssText.trim()) {
            allStyles += cssText + '\n'
        }
    })
    
    return allStyles
}

/**
 * Manually refreshes the stylesheet cache
 * 
 * This function clears the cache and forces a fresh conversion of all stylesheets.
 * Useful when stylesheets are dynamically added or modified after initial load.
 * 
 * @returns Array of CSSStyleSheet objects representing all stylesheets in the document
 * 
 * @example
 * ```typescript
 * // Add a new stylesheet dynamically
 * const newStyle = document.createElement('style')
 * document.head.appendChild(newStyle)
 * 
 * // Refresh the cache to include the new stylesheet
 * refreshStylesheetCache()
 * ```
 */
export function refreshStylesheetCache(): CSSStyleSheet[] {
    cachedConstructedSheets = null
    return convertAllDocumentStylesToConstructed()
}