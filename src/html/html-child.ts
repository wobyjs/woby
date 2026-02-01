
// Helper function to handle function values

import { ObservableOptions } from "soby"

type ChildType = [Function] | null | undefined | boolean | bigint | number | string | symbol | Node | Array<any> | undefined

export const HtmlChild: ObservableOptions<ChildType> = {
  equals: (a: ChildType, b: ChildType) => {
    // Functions are compared by reference
    return a === b
  },
  type: [Function],
  toHtml: (value) => {
    return undefined
  },
  fromHtml: (value) => {
    return undefined
  }
}
