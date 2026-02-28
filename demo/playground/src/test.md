this folder test with

playground> pnpm dev

use devtools mcp goto http://localhost:5276/ (HMR), read console error  & assert log , fix the error 

when i said HMR, it is hot  reload, you DO NOT START pnpm dev or pnpm dev on other port


DO NOT USE pnpm test or playwright on this folder

use Execute MCP tools devtools/list_console_message({
  "types": [
    "error",
    "assert"
  ]
} )