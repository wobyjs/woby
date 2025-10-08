
/* HELPERS */

const IS_BROWSER = !!globalThis.CDATASection?.toString?.().match(/^\s*function\s+CDATASection\s*\(\s*\)\s*\{\s*\[native code\]\s*\}\s*$/)


export const isServer = (): boolean => {

  return !IS_BROWSER

}
