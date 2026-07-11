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
export declare const normalizePropertyPath: (path: string) => string;
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
export declare const setNestedAttribute: (element: HTMLElement, attributeName: string, value: any) => void;
//# sourceMappingURL=nested.d.ts.map