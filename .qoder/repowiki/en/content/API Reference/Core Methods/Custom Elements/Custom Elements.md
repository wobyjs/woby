# Custom Elements

<cite>
**Referenced Files in This Document**   
- [custom_element.ts](file://src/methods/custom_element.ts)
- [nested.ts](file://src/utils/nested.ts)
- [string.ts](file://src/utils/string.ts)
- [defaults.ts](file://src/methods/defaults.ts)
- [stylesheets.ts](file://src/utils/stylesheets.ts)
- [setters.ts](file://src/utils/setters.ts)
- [types.ts](file://src/jsx/types.ts)
- [constants.ts](file://src/constants.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Architecture](#core-architecture)
3. [Property Binding System](#property-binding-system)
4. [Lifecycle Management](#lifecycle-management)
5. [Shadow DOM and Style Encapsulation](#shadow-dom-and-style-encapsulation)
6. [Type Safety and JSX Integration](#type-safety-and-jsx-integration)
7. [Usage Examples](#usage-examples)
8. [Advanced Features](#advanced-features)
9. [Performance Considerations](#performance-considerations)

## Introduction
The `customElement()` API provides a bridge between Woby's reactive system and Web Components, enabling the creation of custom HTML elements with fully reactive properties. This integration allows components to be used seamlessly in both JSX/TSX and standard HTML contexts while maintaining reactivity and type safety. The API automatically handles attribute observation, property binding, and lifecycle management, making it easy to create encapsulated, reusable components that respond to changes in their properties.

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L1-L50)

## Core Architecture

```mermaid
classDiagram
class CustomElement {
+static __component__ : JSX.Component
+static observedAttributes : string[]
+props : P
+propDict : Record~string, string~
+slots : HTMLSlotElement
+placeHolder : Comment
+constructor(props? : P)
+connectedCallback()
+disconnectedCallback()
+attributeChangedCallback1(name : any, oldValue : any, newValue : any)
}
class HTMLElement {
+connectedCallback()
+disconnectedCallback()
+attributeChangedCallback()
}
CustomElement --|> HTMLElement : extends
CustomElement --> "1" JSX.Component : uses
CustomElement --> "1" ShadowRoot : creates
```

**Diagram sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L452-L641)

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L452-L641)

## Property Binding System

```mermaid
flowchart TD
A[Attribute Change] --> B{Contains $ or .?}
B --> |Yes| C[Normalize Property Path]
C --> D[Convert kebab-case to camelCase]
D --> E[Handle Nested Property]
E --> F[Update Observable Value]
B --> |No| G[Convert kebab-case to camelCase]
G --> H[Update Observable Value]
F --> I[Trigger Reactive Update]
H --> I
```

**Diagram sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L605-L641)
- [nested.ts](file://src/utils/nested.ts#L30-L42)
- [string.ts](file://src/utils/string.ts#L27-L29)

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L194-L240)
- [nested.ts](file://src/utils/nested.ts#L30-L42)
- [string.ts](file://src/utils/string.ts#L27-L29)

## Lifecycle Management

```mermaid
sequenceDiagram
participant Element as Custom Element
participant DOM as DOM
participant Observer as MutationObserver
DOM->>Element : connectedCallback()
Element->>Element : Initialize props and attributes
Element->>Element : Setup shadow root
Element->>Element : Render component
Element->>Observer : Observe attribute changes
loop Attribute Changes
Observer->>Element : attributeChangedCallback1()
Element->>Element : Update corresponding prop
Element->>Element : Trigger reactive update
end
DOM->>Element : disconnectedCallback()
Element->>Element : Cleanup resources
```

**Diagram sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L541-L590)

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L541-L590)

## Shadow DOM and Style Encapsulation

```mermaid
graph TD
A[Custom Element] --> B[Shadow Root]
B --> C[Component Content]
B --> D[Adopted StyleSheets]
D --> E[Global Styles]
D --> F[Constructed StyleSheets]
G[Document] --> H[Style Elements]
H --> |Observed| I[Stylesheet Observer]
I --> |Updates| F
J[ignoreStyle=true] --> |Prevents| D
```

**Diagram sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L480-L495)
- [stylesheets.ts](file://src/utils/stylesheets.ts#L1-L115)

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L480-L495)
- [stylesheets.ts](file://src/utils/stylesheets.ts#L1-L115)

## Type Safety and JSX Integration

```mermaid
classDiagram
class ElementAttributes {
+Partial~HTMLAttributes~HTMLElement~~
+Partial~Record~ElementAttributesPattern~P~, any~~
}
class ElementAttributesPattern {
+keyof P
+keyof HTMLAttributes~HTMLElement~
+*
+style.${keyof StyleProperties}
+style.*
}
class ExtractProps {
+T extends (props : infer P) => any ? P : never
}
ElementAttributes --> ElementAttributesPattern : uses
ExtractProps --> ElementAttributes : uses
ElementAttributes --> "1" JSX.StyleProperties : references
```

**Diagram sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L50-L88)
- [types.ts](file://src/jsx/types.ts#L1-L220)

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L50-L88)
- [types.ts](file://src/jsx/types.ts#L1-L220)

## Usage Examples

```mermaid
flowchart TD
A[Define Component] --> B[Use defaults() helper]
B --> C[Define observable props]
C --> D[Create component function]
D --> E[Register with customElement()]
E --> F{Usage Context}
F --> G[HTML Usage]
F --> H[JSX Usage]
G --> I[Attribute binding]
H --> J[Property binding]
I --> K[Automatic type conversion]
J --> K
K --> L[Reactive updates]
```

**Diagram sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L242-L450)
- [defaults.ts](file://src/methods/defaults.ts#L1-L164)

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L242-L450)
- [defaults.ts](file://src/methods/defaults.ts#L1-L164)

## Advanced Features

```mermaid
flowchart TD
A[Nested Properties] --> B[$ notation]
A --> C[. notation]
B --> D[HTML: user$name]
C --> E[JSX: user.name]
D --> F[Normalize to user.name]
E --> F
F --> G[Create nested structure]
G --> H[Update observable]
I[Style Properties] --> J[style$font-size]
I --> K[style.font-size]
J --> L[Convert to style.fontSize]
K --> L
L --> M[Set on element.style]
N[Custom Serialization] --> O[toHtml function]
N --> P[fromHtml function]
O --> Q[Convert to string]
P --> R[Convert from string]
Q --> S[HTML attribute]
R --> T[Observable value]
```

**Diagram sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L194-L240)
- [nested.ts](file://src/utils/nested.ts#L30-L42)
- [string.ts](file://src/utils/string.ts#L27-L29)

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L194-L240)
- [nested.ts](file://src/utils/nested.ts#L30-L42)
- [string.ts](file://src/utils/string.ts#L27-L29)

## Performance Considerations

```mermaid
flowchart TD
A[Attribute Change] --> B{Same value?}
B --> |Yes| C[Exit early]
B --> |No| D{Object string?}
D --> |Yes| E[Exit early]
D --> |No| F[Normalize path]
F --> G{Nested property?}
G --> |Yes| H[Handle nested]
G --> |No| I[Handle flat]
H --> J[Update observable]
I --> J
J --> K[Trigger update]
```

**Diagram sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L605-L641)
- [setters.ts](file://src/utils/setters.ts#L1-L799)

**Section sources**
- [custom_element.ts](file://src/methods/custom_element.ts#L605-L641)
- [setters.ts](file://src/utils/setters.ts#L1-L799)