import type { ObservableOptions } from "~/types"

// Define CSS unit types
// Supports px, em, rem, %, vh, vw, vmin, vmax, ch, ex, pt, pc, in, cm, mm units
export type CSSUnit =
    | `${number}px`
    | `${number}em`
    | `${number}rem`
    | `${number}%`
    | `${number}vh`
    | `${number}vw`
    | `${number}vmin`
    | `${number}vmax`
    | `${number}ch`
    | `${number}ex`
    | `${number}pt`
    | `${number}pc`
    | `${number}in`
    | `${number}cm`
    | `${number}mm`

export type CSSLength = CSSUnit | "auto" | "inherit" | "initial" | "unset" | "" | string | number

// Define the structured representation of CSS length
// Contains value and unit properties with valueOf and toString methods
export interface CSSLengthObject {
    value: number
    unit: string
    valueOf(): string
    toString(): string
}

// Helper function to parse CSS length strings into structured objects
// Treats empty strings as undefined
// Supports CSS keywords (auto, inherit, initial, unset) and numeric values with units
// Treats plain numbers as pixels (e.g., 1 -> 1px)
// Treats plain numbers as pixels (e.g., 1 -> 1px)
const parseCSSLength = (value: CSSLength | CSSLengthObject): CSSLengthObject | string | number | undefined => {
    // If it's an empty string, return undefined
    if (typeof value === 'string' && value === "") {
        return undefined
    }

    // If it's already a structured object, return it
    if (typeof value === 'object' && value !== null && 'value' in value && 'unit' in value) {
        return {
            value: value.value,
            unit: value.unit,
            valueOf: () => `${value.value}${value.unit}`,
            toString: () => `${value.value}${value.unit}`
        }
    }

    // If it's one of the special keywords, return as is
    if (value === "auto" || value === "inherit" || value === "initial" || value === "unset") {
        return value
    }

    // Parse numeric values with units
    const match = (value as string).match(/^(-?\d*\.?\d+)([a-zA-Z%]+)$/)
    if (match) {
        const [, num, unit] = match
        const numericValue = parseFloat(num)
        return {
            value: numericValue,
            unit,
            valueOf: () => `${numericValue}${unit}`,
            toString: () => `${numericValue}${unit}`
        }
    }

    // If it's a plain number, treat as pixels
    if (typeof value === 'string' && /^-?\d*\.?\d+$/.test(value)) {
        const numericValue = parseFloat(value)
        return {
            value: numericValue,
            unit: 'px',
            valueOf: () => `${numericValue}px`,
            toString: () => `${numericValue}px`
        }
    }

    // Return as is if parsing fails
    return value
}

// Helper function to convert structured objects back to strings
// Converts CSSLengthObject to CSS length string
// Converts numbers to pixel values
const stringifyCSSLength = (value: CSSLengthObject | string | number): string => {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return `${value}px`
    return `${value.value}${value.unit}`
}

export const HtmlLength: ObservableOptions</* CSSLength | CSSLengthObject | */ number | string> = {
    equals: (a, b) => {
        const parsedA = parseCSSLength(a)
        const parsedB = parseCSSLength(b)

        // If both are strings, compare directly
        if (typeof parsedA === 'string' && typeof parsedB === 'string') {
            return parsedA === parsedB
        }

        // If both are objects, compare their properties
        if (typeof parsedA === 'object' && typeof parsedB === 'object') {
            return parsedA.value === parsedB.value && parsedA.unit === parsedB.unit
        }

        // Otherwise, they're not equal
        return false
    },
    type: Object,
    toHtml: (value) => {
        const parsed = parseCSSLength(value)
        if (parsed === undefined) return undefined as any
        if (typeof parsed === 'string' || typeof parsed === 'number') return parsed as any
        return stringifyCSSLength(parsed) as any
    },
    fromHtml: (value) => {
        if (typeof value !== 'string') return value
        return parseCSSLength(value as CSSLength) as any//as CSSLengthObject
    }
}