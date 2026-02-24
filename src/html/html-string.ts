import type { ObservableOptions } from "soby"

// Helper function to handle string values
// Treats null and undefined as empty strings
const toString = (value: string | null | undefined): string => {
    if (value === null || value === undefined) return ''
    return String(value)
}

export const HtmlString: ObservableOptions<string | undefined> = {
    equals: (a: string | null | undefined, b: string | null | undefined) => toString(a) === toString(b),
    type: String,
    toHtml: (value) => toString(value),
    fromHtml: (value) => toString(value)
}