import type { ObservableOptions, FunctionMaybe } from "soby"

// Define the types for class values
export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassArray
  | ClassDictionary
  | (() => ClassValue)

export interface ClassDictionary {
  [id: string]: FunctionMaybe<boolean | null | undefined>
}

export interface ClassArray extends Array<ClassValue> { }

// Helper function to convert class values to string
const toClassString = (value: ClassValue): string => {
  if (value === null || value === undefined) return ''

  // Handle string and number directly
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)

  // Handle boolean
  if (typeof value === 'boolean') return value ? '' : ''

  // Handle function
  if (typeof value === 'function') {
    try {
      return toClassString(value())
    } catch {
      return ''
    }
  }

  // Handle array
  if (Array.isArray(value)) {
    return value.map(toClassString).filter(Boolean).join(' ')
  }

  // Handle object/dictionary
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([key, val]) => {
        // Handle observable values
        try {
          const resolvedVal = typeof val === 'function' ? val() : val
          return resolvedVal === true
        } catch {
          return false
        }
      })
      .map(([key]) => key)
      .join(' ')
  }

  return ''
}

export const HtmlClass: ObservableOptions<ClassValue | undefined> = {
  equals: (a, b) => toClassString(a) === toClassString(b),
  type: String,
  toHtml: (value) => toClassString(value),
  fromHtml: (value) => value as ClassValue
}