import type { ObservableOptions } from "~/types"

// Helper function to convert HTML string values to Date
// Treats empty strings and invalid dates as undefined
// Handles various date formats including:
// - ISO date strings
// - Timestamp numbers and numeric strings (e.g. "2141512551")
// - Custom date formats (e.g. "2025 Oct ....")
// - Date objects
const toDate = (value: Date | string | number | undefined): Date | undefined => {
    if (value === undefined || value === '') return undefined

    // If it's already a Date object, return it
    if (value instanceof Date) return isNaN(value.getTime()) ? undefined : value

    // Try to parse as a number (timestamp)
    if (typeof value === 'number') {
        const date = new Date(value)
        return isNaN(date.getTime()) ? undefined : date
    }

    // For strings, try multiple parsing strategies
    if (typeof value === 'string') {
        // First try Date.parse for standard formats
        const timestamp = Date.parse(value)
        if (!isNaN(timestamp)) {
            return new Date(timestamp)
        }

        // Try parsing as a numeric timestamp string
        const numericTimestamp = Number(value)
        if (!isNaN(numericTimestamp)) {
            const date = new Date(numericTimestamp)
            if (!isNaN(date.getTime())) {
                return date
            }
        }

        // Fallback to new Date() for custom formats
        const date = new Date(value)
        return isNaN(date.getTime()) ? undefined : date
    }

    // Fallback for any other type
    const date = new Date(value)
    return isNaN(date.getTime()) ? undefined : date
}

export const HtmlDate: ObservableOptions<Date> = {
    equals: (a: Date | string | number, b: Date | string | number) => {
        const dateA = toDate(a)
        const dateB = toDate(b)
        return (dateA === undefined && dateB === undefined) ||
            (dateA !== undefined && dateB !== undefined && dateA.getTime() === dateB.getTime())
    },
    type: Date,
    toHtml: (value) => {
        const date = toDate(value)
        return date ? date.toISOString() : "" as any
    },
    fromHtml: (value) => toDate(value) || new Date(NaN)
}