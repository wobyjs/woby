import type { ObservableOptions } from "~/types"

// Define the structured representation of CSS style objects
export interface CSSStyleObject {
    [key: string]: string | number
}

export type CSSStyleValue = string | CSSStyleObject

// Helper function to convert HTML string values to CSS style objects
// Treats empty strings and invalid values as undefined
const toStyleObject = (value: CSSStyleValue | undefined): CSSStyleObject | undefined => {
    if (value === undefined || value === '') return undefined

    // If it's already a style object, return it
    if (typeof value === 'object' && value !== null) {
        return value
    }

    // If it's a string, try to parse it as CSS styles
    if (typeof value === 'string') {
        // Handle empty string
        if (value.trim() === '') return undefined

        const style: CSSStyleObject = {}
        const rules = value.split(';')

        for (const rule of rules) {
            const trimmedRule = rule.trim()
            if (trimmedRule) {
                const colonIndex = trimmedRule.indexOf(':')
                if (colonIndex > 0) {
                    const property = trimmedRule.substring(0, colonIndex).trim()
                    const value = trimmedRule.substring(colonIndex + 1).trim()
                    if (property && value) {
                        // Convert CSS property to camelCase
                        const camelCaseProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
                        style[camelCaseProperty] = value
                    }
                }
            }
        }

        return Object.keys(style).length > 0 ? style : undefined
    }

    return undefined
}

// Helper function to convert CSS style objects to CSS string
// Converts camelCase properties back to kebab-case
const stringifyStyleObject = (value: CSSStyleObject | undefined): string => {
    if (value === undefined || value === null) return ""

    const cssRules: string[] = []
    for (const [property, val] of Object.entries(value)) {
        if (property && val !== undefined && val !== null) {
            // Convert camelCase to kebab-case
            const kebabCaseProperty = property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
            cssRules.push(`${kebabCaseProperty}: ${val}`)
        }
    }

    return cssRules.join('; ')
}

export const HtmlStyle: ObservableOptions<CSSStyleValue | string> = {
    // Compare two CSS style values for equality
    // Handles undefined, string, and object values
    equals: (a: CSSStyleValue | undefined, b: CSSStyleValue | undefined) => {
        const styleA = toStyleObject(a)
        const styleB = toStyleObject(b)

        // If both are undefined, they're equal
        if (styleA === undefined && styleB === undefined) return true

        // If only one is undefined, they're not equal
        if (styleA === undefined || styleB === undefined) return false

        // Compare the string representations
        return stringifyStyleObject(styleA) === stringifyStyleObject(styleB)
    },
    type: Object,
    toHtml: (value) => {
        const style = toStyleObject(value)
        return stringifyStyleObject(style) as any
    },
    fromHtml: (value) => {
        return toStyleObject(value) || {}
    }
}