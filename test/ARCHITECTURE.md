# 🏗️ Playground Test Architecture

## System Overview

```mermaid
graph TB
    A[Playwright Test Runner] --> B[beforeAll Hook]
    B --> C[Spawn Dev Server<br/>pnpm dev]
    C --> D{Server Ready?}
    D -->|Yes| E[Navigate to<br/>http://localhost:5276]
    D -->|No Timeout| F[Test Failed]
    
    E --> G[Page Loads<br/>Playground Components]
    G --> H[Components Execute<br/>Test Logic]
    H --> I[console.log/assert<br/>Test Results]
    
    I --> J[Playwright Captures<br/>Console Events]
    J --> K{Parse Assertions}
    K -->|✅ Pass| L[Add to Passed Tests]
    K -->|❌ Fail| M[Add to Failed Tests]
    K -->|ℹ️ Info| N[Log Information]
    
    L --> O[After All Hook]
    M --> O
    N --> O
    
    O --> P[Kill Dev Server]
    P --> Q[Generate Report]
    Q --> R{Any Failures?}
    R -->|Yes| S[Exit Code 1<br/>Show Errors]
    R -->|No| T[Exit Code 0<br/>All Passed]
```

## Component Interaction

```mermaid
sequenceDiagram
    participant Test as Playwright Test
    participant Server as Dev Server<br/>(Vite)
    participant Browser as Chromium
    participant Component as Playground Component
    participant Console as Browser Console
    participant Parser as Assertion Parser
    
    Test->>Server: Spawn (pnpm dev)
    Note over Server: Starts on port 5276
    
    Server-->>Test: Ready Signal
    Test->>Browser: Navigate to localhost:5276
    
    Browser->>Component: Render Component
    Component->>Component: Execute Test Logic
    Component->>Console: log("✅ Test passed")
    
    Console->>Parser: Capture Event
    Parser->>Parser: Extract Test Name
    Parser->>Parser: Determine Pass/Fail
    
    Note over Test,Parser: Wait 10 seconds<br/>for all tests
    
    Test->>Parser: Compile Results
    Parser-->>Test: Test Summary
    
    Test->>Server: Kill Process
    Note over Server: Cleanup complete
```

## Data Flow

```mermaid
flowchart LR
    subgraph Playground
        A[Component.tsx] -->|renders| B[DOM]
        A -->|executes| C[Test Logic]
        C -->|calls| D[console.log]
    end
    
    subgraph Capture
        D -->|emit| E[page.on console]
        E -->|filter| F{Has Emoji?}
        F -->|✅| G[Pass Pattern]
        F -->|❌| H[Fail Pattern]
        F -->|ℹ️| I[Info Pattern]
    end
    
    subgraph Parse
        G --> J[Extract Name]
        H --> K[Extract Name + Error]
        I --> L[Extract Message]
    end
    
    subgraph Report
        J --> M[Results Array]
        K --> M
        L --> M
        M --> N[Summary Stats]
        M --> O[Pass/Fail Decision]
    end
```

## File Structure

```
woby/
├── test/                              # Test Directory
│   ├── playground-console.spec.ts     # Basic console capture
│   ├── playground-assertions.spec.ts  # Advanced assertion parsing ⭐
│   ├── run-tests.js                   # Custom runner (optional)
│   ├── README.md                      # Full documentation
│   ├── QUICKSTART.md                  # Quick start guide
│   └── IMPLEMENTATION_SUMMARY.md      # This summary
│
├── demo/playground/                   # Test Target
│   ├── src/                           # Components with tests
│   │   ├── TestEventClickRemoval.tsx
│   │   ├── TestHMRFor.tsx
│   │   ├── TestCustomElementContext.tsx
│   │   └── util.tsx                   # Test utilities
│   └── index.html                     # Entry point
│
└── playwright.config.ts               # Root configuration
```

## Test Lifecycle

```mermaid
gantt
    title Test Execution Timeline
    dateFormat X
    axisFormat %s
    
    section Setup
    Start Dev Server     :0, 500
    Wait for Ready       :500, 1000
    
    section Execution
    Page Load           :1000, 200
    Component Render    :1200, 300
    Test Execution      :1500, 8000
    Buffer Time         :9500, 2500
    
    section Teardown
    Parse Results       :12000, 500
    Generate Report     :12500, 300
    Kill Server         :12800, 200
```

## Assertion Pattern Matching

```mermaid
flowchart TD
    A[Console Message] --> B{Contains Emoji?}
    B -->|No| C[Ignore]
    B -->|Yes| D{Which Emoji?}
    
    D -->|✅| E[Match Pass Patterns]
    E --> E1[/✅ (.+?) passed/]
    E --> E2[/✅ \[(.+?)\]/]
    E --> E3[/✅ (.+?) test passed/]
    E1 & E2 & E3 --> F[Extract Test Name]
    F --> G[Mark as PASSED]
    
    D -->|❌| H[Match Fail Patterns]
    H --> H1[/❌ (.+?) failed: (.+)/]
    H --> H2[/❌ \[(.+?)\]: (.+)/]
    H1 & H2 --> I[Extract Name + Error]
    I --> J[Mark as FAILED]
    
    D -->|ℹ️| K[Match Info Pattern]
    K --> K1[/ℹ️ (.+)/]
    K1 --> L[Extract Message]
    L --> M[Log as INFO]
```

## Configuration Layers

```mermaid
flowchart TB
    subgraph Layer1[Configuration Priority]
        A[playwright.config.ts] --> B[Test File Config]
        B --> C[Project Defaults]
    end
    
    subgraph Layer2[Key Settings]
        A --> A1[timeout: 60000]
        A --> A2[workers: 1]
        A --> A3[baseURL: localhost:5276]
        A --> A4[headless: true]
    end
    
    subgraph Layer3[Reporters]
        A --> R1[list - Console]
        A --> R2[html - Browser]
    end
```

## Error Handling Flow

```mermaid
flowchart TD
    A[Test Execution] --> B{Error Type?}
    
    B -->|Dev Server Fail| C[Timeout After 30s]
    C --> D[Reject Promise]
    D --> E[Exit with Error]
    
    B -->|Navigation Fail| F[Catch Error]
    F --> G[Log to Console]
    G --> H[Continue Test]
    
    B -->|Runtime Error| I[pageerror Event]
    I --> J[Filter Critical?]
    J -->|Yes| K[Add to Errors]
    J -->|No| L[Ignore Warning]
    K --> M[Fail Test]
    
    B -->|Assertion Fail| N[❌ Detected]
    N --> O[Parse Error Message]
    O --> P[Add to Failed Tests]
    P --> M
```

## Resource Management

```mermaid
flowchart LR
    subgraph Processes
        A[Node.js Runner]
        B[Dev Server<br/>vite]
        C[Playwright<br/>Browser]
    end
    
    subgraph Resources
        D[Port 5276]
        E[CPU/Memory]
        F[Temp Files]
    end
    
    A -->|spawns| B
    B -->|uses| D
    A -->|launches| C
    C -->|consumes| E
    
    A -->|cleanup| G[Kill Processes]
    G -->|releases| D
    G -->|frees| E
    G -->|deletes| F
```

## Parallel vs Sequential

```mermaid
gantt
    title Current: Sequential Execution
    dateFormat X
    axisFormat %s
    
    section Single Worker
    Test 1 Setup       :0, 1000
    Test 1 Execute     :1000, 12000
    Test 1 Teardown    :12000, 500
    
    section Future: Parallel (Not Implemented)
    Test 2 Setup       :1000, 2000
    Test 2 Execute     :2000, 13000
    Test 2 Teardown    :13000, 500
```

## Integration Points

```mermaid
flowchart TB
    subgraph Existing
        A[playground/src/util.tsx]
        A --> B[registerTestObservable]
        A --> C[testObservables registry]
        A --> D[assert function]
    end
    
    subgraph New
        E[playwright-assertions.spec.ts]
        E --> F[Console Log Capture]
        E --> G[Assertion Parser]
        E --> H[Result Reporter]
    end
    
    subgraph Bridge
        B -.->|exposes| I[window.testObservables]
        C -.->|accessible via| J[page.evaluate]
        D -.->|triggers| K[console.assert]
        
        F -->|listens to| K
        G -->|reads from| I
    end
```

## Performance Characteristics

```mermaid
pie
    title Test Execution Time Breakdown
    "Dev Server Startup" : 5
    "Page Load" : 2
    "Test Execution" : 80
    "Parsing & Reporting" : 5
    "Cleanup" : 8
```

## Memory Model

```mermaid
flowchart TB
    subgraph Node.js
        A[Test Process]
        A --> B[Dev Server Child Process]
    end
    
    subgraph Browser
        C[Chromium Instance]
        C --> D[Page Context]
        D --> E[window.testObservables]
        D --> F[Component State]
    end
    
    subgraph Communication
        B -->|HTTP| G[Vite HMR]
        G -->|WebSocket| D
        A -->|Playwright Protocol| C
    end
```

---

**Architecture Status**: ✅ Stable and Production-Ready

**Scalability**: Currently single-worker, designed for sequential execution. Future enhancement could add parallel test groups with isolated dev servers.
