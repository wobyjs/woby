# VSCode Debugger MCP - Complete Usage Guide

This guide shows how to use the VSCode Debugger MCP (configured in mcp.json lines 46-50) to debug TypeScript files with breakpoints and step-into functionality, avoiding console.log reliance.

## 🎯 Setup Overview

Using Debugger MCP connection:
```json
{
  "vscode-debugger": {
    "type": "streamable-http",
    "url": "http://localhost:10101/mcp"
  }
}
```

## 🔧 Essential MCP Debugging Tools

### 1. Setting Breakpoints

**Set breakpoint at component initialization (Line 22):**
```javascript
mcp_vscode-debugger_set_breakpoint({
  filePath: "d:\\Developments\\tslib\\@woby\\woby\\demo\\counter\\debug_br_test.tsx",
  lineNumber: 22
})
```

**Set breakpoint at JSX creation (Line 25):**
```javascript
mcp_vscode-debugger_set_breakpoint({
  filePath: "d:\\Developments\\tslib\\@woby\\woby\\demo\\counter\\debug_br_test.tsx",
  lineNumber: 25
})
```

**Set breakpoint before renderToString (Line 41):**
```javascript
mcp_vscode-debugger_set_breakpoint({
  filePath: "d:\\Developments\\tslib\\@woby\\woby\\demo\\counter\\debug_br_test.tsx",
  lineNumber: 41
})
```

### 2. Starting Debug Sessions

**Launch debug session:**
```javascript
mcp_vscode-debugger_start({
  program: "d:\\Developments\\tslib\\@woby\\woby\\demo\\counter\\debug_br_test.tsx",
  type: "pwa-node",
  name: "Debug BR Test",
  request: "launch",
  runtimeExecutable: "tsx",
  mcpManaged: true,
  console: "integratedTerminal"
})
```

### 3. Execution Control

**Pause execution:**
```javascript
mcp_vscode-debugger_pause()
```

**Continue execution:**
```javascript
mcp_vscode-debugger_continue()
```

**Step over (execute line, skip function internals):**
```javascript
mcp_vscode-debugger_step_over()
```

**Step into (enter function calls):**
```javascript
mcp_vscode-debugger_step_in()
```

**Step out (exit current function):**
```javascript
mcp_vscode-debugger_step_out()
```

### 4. State Inspection

**Get active threads:**
```javascript
mcp_vscode-debugger_get_threads()
```

**Get stack trace (requires thread ID):**
```javascript
mcp_vscode-debugger_get_stack_trace({
  threadId: 1
})
```

**Get variables in current scope:**
```javascript
mcp_vscode-debugger_get_variables({
  variablesReference: scopeReference,
  frameId: stackFrameId
})
```

**Evaluate expressions:**
```javascript
mcp_vscode-debugger_evaluate_expression({
  expression: "element",
  threadId: 1,
  frameId: currentFrameId
})
```

## 📍 Strategic Breakpoint Locations

Your `debug_br_test.tsx` file has these key debugging points:

### Component Flow Debugging
1. **Line 22** (`// 🔴 BREAKPOINT 1: Component initialization`)
   - Inspect component props and initial state
   - See `DEBUG_DATA` object contents

2. **Line 25** (`// 🔴 BREAKPOINT 2: JSX element creation`)
   - Watch JSX transformation in real-time
   - Inspect the `element` variable structure

3. **Line 28** (`// 🔴 BREAKPOINT 3: Element inspection`)
   - Examine element properties and type
   - Verify JSX was processed correctly

4. **Line 32** (`// 🔴 BREAKPOINT 4: Return statement`)
   - See what's being returned from component
   - Inspect final element structure

### Rendering Pipeline Debugging
5. **Line 36** (`// 🔴 BREAKPOINT 5: Main execution start`)
   - Entry point of main execution
   - See initial program state

6. **Line 41** (`// 🔴 BREAKPOINT 6: Before renderToString`)
   - Pre-rendering state inspection
   - Component ready for rendering

7. **Line 44** (`// 🔴 BREAKPOINT 7: After renderToString`)
   - Inspect rendered HTML result
   - Compare with expected output

8. **Line 48** (`// 🔴 BREAKPOINT 8: Result validation`)
   - See test outcome (PASS/FAIL)
   - Inspect success criteria evaluation

### Error Handling & Completion
9. **Line 52** (`// 🔴 BREAKPOINT 9: Error handling`)
   - Debug error scenarios
   - Inspect error object properties

10. **Line 57** (`// 🔴 BREAKPOINT 10: Program completion`)
    - Final program state
    - See all processing completed

### Helper Function Debugging
11. **Line 68** (`// 🔴 BREAKPOINT 11: Loop iteration`)
    - Step through processData loop
    - Watch `i` counter and `data` array processing

12. **Line 74** (`// 🔴 BREAKPOINT 12: Final function call`)
    - Last execution point
    - Program termination

## 🎮 Complete Debugging Workflow

### Step 1: Prepare Breakpoints
```javascript
// Set all key breakpoints
await mcp_vscode-debugger_set_breakpoint({
  filePath: "d:\\Developments\\tslib\\@woby\\woby\\demo\\counter\\debug_br_test.tsx",
  lineNumber: 22
});

await mcp_vscode-debugger_set_breakpoint({
  filePath: "d:\\Developments\\tslib\\@woby\\woby\\demo\\counter\\debug_br_test.tsx",
  lineNumber: 25
});

await mcp_vscode-debugger_set_breakpoint({
  filePath: "d:\\Developments\\tslib\\@woby\\woby\\demo\\counter\\debug_br_test.tsx",
  lineNumber: 41
});
```

### Step 2: Start Debug Session
```javascript
await mcp_vscode-debugger_start({
  program: "d:\\Developments\\tslib\\@woby\\woby\\demo\\counter\\debug_br_test.tsx",
  type: "pwa-node",
  name: "BR Element Debug",
  request: "launch",
  runtimeExecutable: "tsx",
  mcpManaged: true
});
```

### Step 3: Navigate Execution
```javascript
// When breakpoint hits at Line 22:
// 1. Inspect component initialization
await mcp_vscode-debugger_get_variables({
  variablesReference: currentScopeRef,
  frameId: currentFrameId
});

// 2. Step over to see JSX creation
await mcp_vscode-debugger_step_over();

// 3. Step into renderToString at Line 41
await mcp_vscode-debugger_step_in();

// 4. Continue to next breakpoint
await mcp_vscode-debugger_continue();
```

### Step 4: Inspect Variables
```javascript
// Evaluate specific expressions
await mcp_vscode-debugger_evaluate_expression({
  expression: "DEBUG_DATA",
  threadId: 1,
  frameId: currentFrameId
});

await mcp_vscode-debugger_evaluate_expression({
  expression: "element",
  threadId: 1,
  frameId: currentFrameId
});

await mcp_vscode-debugger_evaluate_expression({
  expression: "result",
  threadId: 1,
  frameId: currentFrameId
});
```

## 🛠️ Advanced Debugging Techniques

### Conditional Breakpoints
Set breakpoints that only trigger under specific conditions:
```javascript
// Break only when processing specific data
// (Set manually in VSCode UI or via extended MCP calls)
Condition: data[i] === 'item2'
```

### Watch Expressions
Monitor variables continuously:
```javascript
// Add to watch panel:
// - element
// - result  
// - DEBUG_DATA
// - i (loop counter)
```

### Call Stack Navigation
```javascript
// Get thread information
const threads = await mcp_vscode-debugger_get_threads();

// Get detailed stack trace
const stackTrace = await mcp_vscode-debugger_get_stack_trace({
  threadId: threads[0].id
});

// Navigate between stack frames
// (Use frame IDs from stack trace for variable inspection)
```

## 🚫 No More Console.log Reliance

With MCP debugging, you can:
- ✅ **Inspect actual variable values** in real-time
- ✅ **Step through code execution** line by line
- ✅ **See call stack hierarchy** and function flow
- ✅ **Evaluate expressions** on-demand
- ✅ **Modify and continue** without restarting
- ✅ **Set conditional breakpoints** for targeted debugging

## 🎯 Pro Tips

1. **Start with "Stop on Entry"** configuration to understand program flow
2. **Use Step Into (`F11`)** to dive into library functions like `renderToString`
3. **Set multiple breakpoints** to create a debugging trail through execution
4. **Use the Call Stack panel** to navigate back through function calls
5. **Evaluate expressions** instead of adding temporary console.log statements
6. **Use Watch panel** for continuous variable monitoring

## 🔄 The "Stop, Look, and Move" Debugging Workflow

This is a perfect logical sequence for an AI-driven debugging workflow. By following this "Stop, Look, and Move" pattern, the AI acts as a surgical investigator.

### Phase 1: Preparation & Initiation
Before the code runs, establish the "trap."

- `set_breakpoint`: Identify suspicious lines and place markers
- `start`: Launch the debug session

> Note: The debugger auto-pauses at the breakpoint; no command is needed to stop it.

### Phase 2: State Inspection (The "Get" Loop)
Now that the code is frozen at the first breakpoint, gather "intelligence" to build a mental map of the app's state.

- `get_stack_trace`: Look at the call path to see how we arrived at this line
- `get_scopes`: Identify what levels of data are accessible (Local vs. Global)
- `get_variables`: Extract the actual values (e.g., "Is user_id null?")
- `evaluate_expression`: Calculate conditions not in the code (e.g., `total * 1.05`)

### Phase 3: Controlled Execution (The "Step" Loop)
The AI now moves the "playhead" of the code to see how variables change over time.

- `step_over`: Move to the next line in the current function
- `step_in`: Dive into a function call to investigate internal logic
- `step_out`: Jump back out to the caller once internal logic is verified

> Repeat Phase 2 during every step to see how variables evolve.

### Phase 4: Resolution or Pivot
Based on what the "Step" loop reveals, make a final decision.

- **Problem Found**: Identify the logic error (e.g., an incorrect if statement) and prepare a fix
- **Trace Enough**: If sufficient data is gathered to understand behavior, prepare to terminate
- `continue`: Tell the program to run until the next breakpoint if the bug hasn't appeared yet
- `stop`: Kill the session once the investigation is complete or the trace is sufficient

## 📋 Quick Reference Commands

| Action | MCP Tool | Purpose |
|--------|----------|---------|
| Set BP | `mcp_vscode-debugger_set_breakpoint` | Add breakpoint at specific line |
| Start | `mcp_vscode-debugger_start` | Begin debug session |
| Pause | `mcp_vscode-debugger_pause` | Halt execution |
| Continue | `mcp_vscode-debugger_continue` | Resume execution |
| Step Over | `mcp_vscode-debugger_step_over` | Execute line, skip functions |
| Step Into | `mcp_vscode-debugger_step_in` | Enter function calls |
| Step Out | `mcp_vscode-debugger_step_out` | Exit current function |
| Get Threads | `mcp_vscode-debugger_get_threads` | List active threads |
| Stack Trace | `mcp_vscode-debugger_get_stack_trace` | Show call stack |
| Scopes | `mcp_vscode-debugger_get_scopes` | Get scope information |
| Variables | `mcp_vscode-debugger_get_variables` | Inspect scope variables |
| Evaluate | `mcp_vscode-debugger_evaluate_expression` | Run expressions |

---

**Ready to debug!** Use these MCP tools to step into your source code and inspect execution flow directly, bypassing the need for console.log output entirely. 🎯