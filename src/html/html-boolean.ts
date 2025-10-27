import type { ObservableOptions } from "soby"

// Helper function to convert HTML string values to boolean
// Treats empty strings and 'true' as true, and everything else as false
const is = (value: boolean | string | undefined) => value === '' || value === 'true' || value === true

export const HtmlBoolean: ObservableOptions<boolean | string | undefined> = {
    equals: (a, b) => is(a) === is(b),
    type: Boolean,
    toHtml: (value) => is(value) ? '' : undefined as any, // Return empty string for true, undefined for false
    fromHtml: (value) => is(value)
}
