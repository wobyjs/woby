# Server-Side Rendering

<cite>
**Referenced Files in This Document**   
- [render.ssr.ts](file://src/methods/render.ssr.ts)
- [fragment.ssr.ts](file://src/utils/fragment.ssr.ts)
- [setters.ssr.ts](file://src/utils/setters.ssr.ts)
- [creators.ssr.ts](file://src/utils/creators.ssr.ts)
- [resolvers.ssr.ts](file://src/utils/resolvers.ssr.ts)
- [render_to_string.ssr.ts](file://src/methods/render_to_string.ssr.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [SSR Rendering Method Overview](#ssr-rendering-method-overview)
3. [Virtual Container and Fragment Management](#virtual-container-and-fragment-management)
4. [String-Based Output Generation](#string-based-output-generation)
5. [FragmentUtils and Render Tree Construction](#fragmentutils-and-render-tree-construction)
6. [Node Conversion and HTML String Extraction](#node-conversion-and-html-string-extraction)
7. [Server-Side Rendering Example](#server-side-rendering-example)
8. [Integration with Server Frameworks](#integration-with-server-frameworks)
9. [Hydration Considerations](#hydration-considerations)
10. [Performance Implications](#performance-implications)
11. [Common SSR Pitfalls](#common-ssr-pitfalls)

## Introduction
Woby's server-side rendering (SSR) implementation provides a robust mechanism for rendering components on the server using a virtual DOM environment. The framework leverages happy-dom or similar DOM implementations to create a browser-like environment in Node.js, enabling consistent rendering behavior between server and client. This documentation details the inner workings of Woby's SSR rendering method, focusing on the `render()` function in `render.ssr.ts` and its supporting utilities.

## SSR Rendering Method Overview

The SSR rendering process in Woby is centered around the `render()` function, which operates in a Node.js environment to generate HTML strings from components. The function creates a virtual container object and uses FragmentUtils to construct the render tree, ultimately converting the rendered children into HTML strings for server responses.

```mermaid
flowchart TD
A["render(child: Child)"] --> B["Create virtual container"]
B --> C["Initialize error stack"]
C --> D["Create root fragment"]
D --> E["Set child content"]
E --> F["Get rendered children"]
F --> G{"Children array?"}
G --> |Yes| H["Map nodes to HTML strings"]
G --> |No| I["Convert single node to string"]
H --> J["Join strings"]
I --> J
J --> K["Return HTML string"]
```

**Diagram sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)

**Section sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)

## Virtual Container and Fragment Management

Woby's SSR implementation creates a virtual container object to serve as the rendering target in the server environment. This container is a plain JavaScript object with a children property, simulating a DOM element without requiring an actual browser environment.

The rendering process utilizes fragments to manage component trees efficiently. A fragment is created as the root container for the render tree, allowing for the composition of multiple child elements without introducing additional DOM nodes.

```mermaid
classDiagram
class Fragment {
+values : any
+length : number
+fragmented? : boolean
}
class FragmentUtils {
+make() : Fragment
+makeWithNode(node : any) : FragmentNode
+makeWithFragment(fragment : Fragment) : FragmentFragment
+getChildren(thiz : Fragment) : any | any[]
+pushFragment(thiz : Fragment, fragment : Fragment) : void
+pushNode(thiz : Fragment, node : any) : void
+pushValue(thiz : Fragment, value : any) : void
+replaceWithNode(thiz : Fragment, node : any) : void
+replaceWithFragment(thiz : Fragment, fragment : Fragment) : void
}
FragmentUtils --> Fragment : "creates and manages"
```

**Diagram sources**
- [fragment.ssr.ts](file://src/utils/fragment.ssr.ts#L8-L144)

**Section sources**
- [fragment.ssr.ts](file://src/utils/fragment.ssr.ts#L8-L144)
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)

## String-Based Output Generation

The SSR rendering method generates string-based output by traversing the rendered component tree and extracting HTML representations of each node. The process begins with creating a container object and an error stack, which serves as a lightweight context for tracking the rendering operation.

The core of string generation lies in the conversion of rendered children to HTML strings. When the render tree is complete, the children are extracted from the fragment and converted to their string representations using outerHTML or textContent properties.

```mermaid
flowchart TD
A["Start Rendering"] --> B["Create Container Object"]
B --> C["Initialize Stack"]
C --> D["Create Root Fragment"]
D --> E["Set Child Content"]
E --> F["Resolve Child Components"]
F --> G["Apply Setters and Directives"]
G --> H["Generate Node Tree"]
H --> I["Extract HTML Strings"]
I --> J["Return Final HTML"]
```

**Diagram sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)
- [setters.ssr.ts](file://src/utils/setters.ssr.ts#L356-L360)

**Section sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)
- [setters.ssr.ts](file://src/utils/setters.ssr.ts#L356-L360)

## FragmentUtils and Render Tree Construction

FragmentUtils is a utility class that plays a crucial role in constructing the render tree during SSR. It provides methods for creating and manipulating fragments, which serve as containers for DOM nodes and other fragments in the render tree.

The FragmentUtils.make() method creates a new fragment with initialized values and length properties. Fragments can contain single nodes, arrays of nodes, or other fragments, allowing for flexible tree structures. The utility provides methods to push nodes and fragments into existing fragments, as well as to retrieve children from fragments in various formats.

```mermaid
sequenceDiagram
participant Render as render()
participant FragmentUtils as FragmentUtils
participant Setters as setters.ssr
Render->>FragmentUtils : make()
FragmentUtils-->>Render : Fragment
Render->>Setters : setChild(container, child, fragment, stack)
Setters->>Setters : resolveChild(child, setter, false, stack)
Setters->>FragmentUtils : pushNode(fragment, node)
FragmentUtils-->>Setters : void
Setters-->>Render : void
Render->>FragmentUtils : getChildren(fragment)
FragmentUtils-->>Render : children
Render->>Render : Convert children to HTML string
```

**Diagram sources**
- [fragment.ssr.ts](file://src/utils/fragment.ssr.ts#L8-L144)
- [setters.ssr.ts](file://src/utils/setters.ssr.ts#L356-L360)
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)

**Section sources**
- [fragment.ssr.ts](file://src/utils/fragment.ssr.ts#L8-L144)
- [setters.ssr.ts](file://src/utils/setters.ssr.ts#L356-L360)

## Node Conversion and HTML String Extraction

The process of converting rendered children into HTML strings involves handling both individual nodes and arrays of nodes. When the render tree is complete, the children are extracted from the fragment using FragmentUtils.getChildren().

For arrays of nodes, each node is processed to extract its HTML representation. The system checks for outerHTML property first, which provides the complete HTML markup including tags. If outerHTML is not available, it falls back to textContent for text nodes, or uses toString() as a final fallback.

```mermaid
flowchart TD
A["Get Rendered Children"] --> B{"Is Array?"}
B --> |Yes| C["Iterate Through Nodes"]
B --> |No| D["Process Single Node"]
C --> E["Check for outerHTML"]
D --> F["Check for outerHTML"]
E --> G{"Has outerHTML?"}
F --> H{"Has outerHTML?"}
G --> |Yes| I["Use outerHTML"]
G --> |No| J["Check textContent"]
H --> |Yes| K["Use outerHTML"]
H --> |No| L["Check textContent"]
J --> M{"Has textContent?"}
L --> N{"Has textContent?"}
M --> |Yes| O["Use textContent"]
M --> |No| P["Use toString()"]
N --> |Yes| Q["Use textContent"]
N --> |No| R["Use toString()"]
O --> S["Add to Result"]
P --> S
Q --> S
R --> S
S --> T["Join Strings"]
T --> U["Return HTML"]
```

**Diagram sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)
- [render_to_string.ssr.ts](file://src/methods/render_to_string.ssr.ts#L7-L41)

**Section sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)
- [render_to_string.ssr.ts](file://src/methods/render_to_string.ssr.ts#L7-L41)

## Server-Side Rendering Example

A typical server-side rendering implementation using Woby involves creating a component and rendering it to an HTML string for inclusion in an HTTP response. The process is synchronous, making it suitable for server environments where blocking operations are acceptable.

```mermaid
sequenceDiagram
participant Server as HTTP Server
participant Render as Woby SSR
participant Component as Component
Server->>Render : render(Component)
Render->>Component : Resolve component
Component-->>Render : JSX Elements
Render->>Render : Create virtual container
Render->>Render : Initialize fragment
Render->>Render : Apply setters
Render->>Render : Generate node tree
Render->>Render : Extract HTML string
Render-->>Server : HTML string
Server->>Client : HTTP Response with HTML
```

**Diagram sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)
- [setters.ssr.ts](file://src/utils/setters.ssr.ts#L356-L360)

**Section sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)

## Integration with Server Frameworks

Woby's SSR capabilities can be integrated with various server frameworks such as Express, Fastify, or custom HTTP servers. The synchronous nature of the rendering process makes it straightforward to incorporate into request handlers, where the rendered HTML string can be directly sent as a response.

The integration typically involves importing the render function and using it within route handlers to generate HTML for specific components based on request parameters or application state.

```mermaid
graph TB
A["HTTP Request"] --> B["Server Framework"]
B --> C["Route Handler"]
C --> D["Create Component with Props"]
D --> E["Call render(component)"]
E --> F["Get HTML String"]
F --> G["Send Response"]
G --> H["HTTP Response"]
```

**Diagram sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)

**Section sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)

## Hydration Considerations

When using SSR with Woby, hydration is the process of attaching event listeners and making the server-rendered HTML interactive on the client side. The framework must ensure that the client-side component tree matches the server-rendered HTML to enable seamless hydration.

Key considerations include maintaining consistent component state between server and client, ensuring event handlers are properly attached, and managing any differences in environment-specific code execution.

```mermaid
sequenceDiagram
participant Server as Server
participant Client as Client
participant Hydration as Hydration
Server->>Client : Send HTML with component data
Client->>Hydration : Load Woby framework
Hydration->>Hydration : Find server-rendered nodes
Hydration->>Hydration : Attach event listeners
Hydration->>Hydration : Restore component state
Hydration-->>Client : Interactive application
```

**Diagram sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)

**Section sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)

## Performance Implications

The synchronous rendering approach used by Woby's SSR implementation has several performance implications. On the positive side, it simplifies the rendering logic and avoids the complexity of asynchronous operations. However, it can block the event loop during rendering, potentially affecting server throughput.

Performance optimization strategies include component memoization, selective server rendering of critical content, and implementing caching mechanisms for frequently rendered components.

```mermaid
flowchart TD
A["Performance Factors"] --> B["Synchronous Rendering"]
A --> C["Virtual DOM Implementation"]
A --> D["Component Complexity"]
A --> E["Caching Strategy"]
B --> F["Pros: Simpler code, predictable execution"]
B --> G["Cons: Blocks event loop, limits concurrency"]
C --> H["Pros: Consistent rendering, no browser dependency"]
C --> I["Cons: Memory overhead, implementation fidelity"]
D --> J["Pros: Rich UI capabilities"]
D --> K["Cons: Increased rendering time"]
E --> L["Pros: Reduced rendering overhead"]
E --> M["Cons: Memory usage, cache invalidation"]
```

**Diagram sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)
- [creators.ssr.ts](file://src/utils/creators.ssr.ts#L8-L18)

**Section sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)
- [creators.ssr.ts](file://src/utils/creators.ssr.ts#L8-L18)

## Common SSR Pitfalls

Several common pitfalls can occur when implementing SSR with Woby. Context isolation is crucial to prevent state leakage between requests, as shared state can lead to security vulnerabilities and inconsistent rendering results.

Global state leakage is another significant concern, where mutable global variables can retain state from previous requests, causing unexpected behavior. Proper request-scoped state management and avoiding global mutable state are essential for reliable SSR.

```mermaid
flowchart TD
A["Common SSR Pitfalls"] --> B["Context Isolation"]
A --> C["Global State Leakage"]
A --> D["Environment Differences"]
A --> E["Memory Management"]
B --> F["Issue: Shared state between requests"]
B --> G["Solution: Request-scoped contexts"]
C --> H["Issue: Global variables retaining state"]
C --> I["Solution: Avoid mutable globals"]
D --> J["Issue: Browser APIs not available"]
D --> K["Solution: Feature detection and fallbacks"]
E --> L["Issue: Memory leaks from uncached components"]
E --> M["Solution: Proper cleanup and caching"]
```

**Diagram sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)
- [resolvers.ssr.ts](file://src/utils/resolvers.ssr.ts#L7-L182)

**Section sources**
- [render.ssr.ts](file://src/methods/render.ssr.ts#L7-L25)
- [resolvers.ssr.ts](file://src/utils/resolvers.ssr.ts#L7-L182)