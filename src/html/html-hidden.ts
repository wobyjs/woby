// Helper function to handle function values

import { ObservableOptions } from "soby"

type ChildType = [Function] | null | undefined | boolean | bigint | number | string | symbol | Node | Array<any> | undefined

export const HtmlHidden: ObservableOptions<any> = {
  equals: (a: any, b: any) => {
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