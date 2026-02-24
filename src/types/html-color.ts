import type { ObservableOptions } from "../types"

// Define the structured representation of RGB color values
// Contains r, g, b properties with valueOf and toString methods
export interface CSSColorObject {
    r: number
    g: number
    b: number
    valueOf(): string
    toString(): string
}

export type CSSColorValue = string | number | CSSColorObject

// Helper function to parse CSS color strings into structured objects
// Treats empty strings as undefined
// Supports hex colors (#rgb, #rrggbb), RGB objects, and numeric values
const parseCSSColor = (value: CSSColorValue): CSSColorObject | string | undefined => {
    // If it's an empty string, return undefined
    if (value === "") {
        return undefined
    }

    // If it's already a structured object, return it
    if (typeof value === 'object' && value !== null && 'r' in value && 'g' in value && 'b' in value) {
        return {
            r: value.r,
            g: value.g,
            b: value.b,
            valueOf: () => `#${Math.min(255, Math.max(0, value.r)).toString(16).padStart(2, '0')}${Math.min(255, Math.max(0, value.g)).toString(16).padStart(2, '0')}${Math.min(255, Math.max(0, value.b)).toString(16).padStart(2, '0')}`,
            toString: () => `#${Math.min(255, Math.max(0, value.r)).toString(16).padStart(2, '0')}${Math.min(255, Math.max(0, value.g)).toString(16).padStart(2, '0')}${Math.min(255, Math.max(0, value.b)).toString(16).padStart(2, '0')}`
        }
    }

    // If it's a string, try to parse it
    if (typeof value === 'string') {
        // Handle hex format #rgb or #rrggbb
        if (value.startsWith('#')) {
            const hex = value.slice(1)
            if (hex.length === 3) {
                const r = parseInt(hex[0] + hex[0], 16)
                const g = parseInt(hex[1] + hex[1], 16)
                const b = parseInt(hex[2] + hex[2], 16)
                return {
                    r, g, b,
                    valueOf: () => value,
                    toString: () => value
                }
            } else if (hex.length === 6) {
                const r = parseInt(hex.slice(0, 2), 16)
                const g = parseInt(hex.slice(2, 4), 16)
                const b = parseInt(hex.slice(4, 6), 16)
                return {
                    r, g, b,
                    valueOf: () => value,
                    toString: () => value
                }
            }
        }
        // Return as is if parsing fails
        return value
    }

    // If it's a number, treat as RGB integer
    if (typeof value === 'number') {
        const r = (value >> 16) & 0xFF
        const g = (value >> 8) & 0xFF
        const b = value & 0xFF
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        return {
            r, g, b,
            valueOf: () => hex,
            toString: () => hex
        }
    }

    // Return as is if parsing fails
    return String(value)
}

// Helper function to convert structured objects back to strings
// Converts CSSColorObject to hex color string
const stringifyCSSColor = (value: CSSColorObject | string): string => {
    if (typeof value === 'string') return value
    return `#${Math.min(255, Math.max(0, value.r)).toString(16).padStart(2, '0')}${Math.min(255, Math.max(0, value.g)).toString(16).padStart(2, '0')}${Math.min(255, Math.max(0, value.b)).toString(16).padStart(2, '0')}`
}

export const HtmlColor: ObservableOptions</* CSSColorValue */ string> = {
    equals: (a, b) => {
        const parsedA = parseCSSColor(a)
        const parsedB = parseCSSColor(b)

        // If both are strings, compare directly
        if (typeof parsedA === 'string' && typeof parsedB === 'string') {
            return parsedA === parsedB
        }

        // If both are objects, compare their properties
        if (typeof parsedA === 'object' && typeof parsedB === 'object' &&
            'r' in parsedA && 'r' in parsedB) {
            return parsedA.r === parsedB.r &&
                parsedA.g === parsedB.g &&
                parsedA.b === parsedB.b
        }

        // Otherwise, they're not equal
        return false
    },
    type: String,
    toHtml: (value) => {
        const parsed = parseCSSColor(value)
        if (parsed === undefined) return undefined as any
        return stringifyCSSColor(parsed) as any
    },
    fromHtml: (value) => {
        return value //as CSSColorValue
    }
}