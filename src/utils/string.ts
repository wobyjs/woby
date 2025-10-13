/**
 * String utility functions for the Woby framework
 * 
 * This module provides utility functions for string manipulation commonly used
 * in web development, particularly for converting between different naming conventions
 * such as kebab-case and camelCase.
 * 
 * @module stringUtils
 */

/**
 * Converts kebab-case strings to camelCase
 * 
 * Utility function to convert CSS-style property names to JavaScript-style property names.
 * For example: 'font-size' becomes 'fontSize'
 * This is used to convert HTML attribute names to JavaScript property names since HTML attributes
 * are case-insensitive and commonly use kebab-case, while JavaScript properties typically use camelCase.
 * 
 * @param str - The kebab-case string to convert
 * @returns The camelCase version of the input string
 * 
 * @example
 * ```typescript
 * kebabToCamelCase('font-size') // returns 'fontSize'
 * kebabToCamelCase('background-color') // returns 'backgroundColor'
 * ```
 */
export const kebabToCamelCase = (str: string): string => {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

/**
 * Converts camelCase strings to kebab-case
 * 
 * Utility function to convert JavaScript-style property names to CSS-style property names.
 * For example: 'fontSize' becomes 'font-size'
 * 
 * @param str - The camelCase string to convert
 * @returns The kebab-case version of the input string
 * 
 * @example
 * ```typescript
 * camelToKebabCase('fontSize') // returns 'font-size'
 * camelToKebabCase('backgroundColor') // returns 'background-color'
 * ```
 */
export const camelToKebabCase = (str: string): string => {
    return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
}

/**
 * Normalizes attribute names by converting kebab-case to camelCase
 * 
 * This function is used to normalize HTML attribute names to JavaScript property names.
 * It handles both kebab-case and dot notation attributes.
 * 
 * @param name - The attribute name to normalize
 * @returns The normalized attribute name
 * 
 * @example
 * ```typescript
 * normalizeAttributeName('font-size') // returns 'fontSize'
 * normalizeAttributeName('style$font-size') // returns 'style.fontSize'
 * normalizeAttributeName('nested$prop$value') // returns 'nested.prop.value'
 * ```
 */
export const normalizeAttributeName = (name: string): string => {
    // Convert $ notation to dot notation
    if (name.includes('$')) {
        name = name.replace(/\$/g, '.')
    }
    
    // Convert kebab-case to camelCase for each part
    if (name.includes('.')) {
        return name.split('.').map(part => kebabToCamelCase(part)).join('.')
    }
    
    return kebabToCamelCase(name)
}