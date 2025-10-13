/**
 * Nested property utility functions for the Woby framework
 * 
 * This module provides utility functions for handling nested properties
 * in HTML attributes and JavaScript objects, supporting both $ and . notation.
 * 
 * Features:
 * - Normalization of property paths with $ and . notation
 * - Conversion from kebab-case to camelCase for each path segment
 * - Setting of nested properties on HTML elements
 * 
 * @module nestedUtils
 */

import { kebabToCamelCase } from './string'

/**
 * Normalizes nested property paths by converting $ notation to dot notation
 * and converting kebab-case to camelCase for each part.
 * 
 * @param path - The property path to normalize (e.g., 'style$font-size' or 'nested.prop.value')
 * @returns The normalized property path with camelCase parts
 * 
 * @example
 * ```typescript
 * normalizePropertyPath('style$font-size') // returns 'style.fontSize'
 * normalizePropertyPath('nested$prop$value') // returns 'nested.prop.value'
 * normalizePropertyPath('background-color') // returns 'backgroundColor'
 * ```
 */
export const normalizePropertyPath = (path: string): string => {
    // Convert $ notation to dot notation
    if (path.includes('$')) {
        path = path.replace(/\$/g, '.')
    }

    // Convert kebab-case to camelCase for each part
    if (path.includes('.')) {
        return path.split('.').map(part => kebabToCamelCase(part)).join('.')
    }

    return kebabToCamelCase(path)
}

/**
 * Sets nested properties on an element from attribute names
 * 
 * Handles setting properties that may be nested objects or style properties.
 * Style properties are converted from kebab-case to camelCase and set on the element's style.
 * Nested properties are created in the element's props object.
 * 
 * @param element - The HTMLElement to set properties on
 * @param attributeName - The attribute name (e.g., 'style$font-size' or 'nested$prop$value')
 * @param value - The value to set
 * 
 * @example
 * ```typescript
 * setNestedAttribute(element, 'style$font-size', '16px')
 * setNestedAttribute(element, 'nested$prop$value', 'test')
 * ```
 */
export const setNestedAttribute = (element: HTMLElement, attributeName: string, value: any): void => {
    const normalizedPath = normalizePropertyPath(attributeName)

    // For style properties, handle them specially
    if (normalizedPath.startsWith('style.')) {
        const styleProperty = normalizedPath.slice(6) // Remove 'style.' prefix
        if (element.style) {
            element.style[styleProperty as any] = value
        }
        return
    }

    // For other properties with dots, create nested structure in props
    if (normalizedPath.includes('.')) {
        const keys = normalizedPath.split('.')
        const lastKey = keys.pop()

        // Navigate to the nested object in props
        let target = element as any
        if (!target.props) {
            target.props = {}
        }
        target = target.props

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            if (!(key in target) || typeof target[key] !== 'object' || target[key] === null) {
                target[key] = {}
            }
            target = target[key]
        }

        // Set the final property
        if (lastKey) {
            target[lastKey] = value
        }
        return
    }

    // For simple properties, set them directly
    const propName = kebabToCamelCase(normalizedPath)
    element[propName] = value
}