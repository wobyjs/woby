# Utilities

<cite>
**Referenced Files in This Document**   
- [classlist.ts](file://src/utils/classlist.ts)
- [stylesheets.ts](file://src/utils/stylesheets.ts)
- [setters.ts](file://src/utils/setters.ts)
- [nested.ts](file://src/utils/nested.ts)
- [lang.ts](file://src/utils/lang.ts)
- [string.ts](file://src/utils/string.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Class Management](#class-management)
3. [Style Handling](#style-handling)
4. [DOM Manipulation Utilities](#dom-manipulation-utilities)
5. [Nested Property Support](#nested-property-support)
6. [Practical Examples](#practical-examples)
7. [Performance Considerations](#performance-considerations)
8. [Best Practices](#best-practices)

## Introduction
The Woby framework provides a comprehensive set of utility functions designed to simplify common web development tasks. These utilities focus on efficient class management, style manipulation, DOM updates, and handling of nested properties through HTML attributes. The helper functions are optimized for performance while maintaining a clean and intuitive API for developers. This document explores the key utility modules and their implementation details, providing guidance on effective usage patterns.

## Class Management

The class management system in Woby is implemented in `classlist.ts` and provides optimized functions for manipulating CSS classes on DOM elements. The core function `classesToggle` implements both optimized and regular paths for class manipulation, ensuring maximum performance in various scenarios.

The utility supports multiple input types including strings, arrays, and reactive expressions. When working with simple cases (empty className or exact matches), the implementation uses direct assignment to className for optimal performance. For more complex cases involving multiple classes, it falls back to using the classList API with proper splitting and iteration.

```mermaid
flowchart TD
Start([Start classesToggle]) --> CheckString["isString(className)?"]
CheckString --> |Yes| CheckEmpty["!className?"]
CheckEmpty --> |Yes| CheckForce["force?"]
CheckForce --> |True| SetClassName["element.className = classes"]
CheckForce --> |False| ReturnEmpty["Return"]
CheckEmpty --> |No| CheckDeletion["!force && className === classes?"]
CheckDeletion --> |Yes| ClearClassName["element.className = ''"]
CheckDeletion --> |No| CheckSpace["classes.includes(' ')?"]
CheckSpace --> |Yes| SplitClasses["classes.split(' ')"]
SplitClasses --> LoopClasses["forEach cls"]
LoopClasses --> CheckLength["cls.length > 0?"]
CheckLength --> |Yes| ToggleClass["element.classList.toggle(cls, !!force)"]
CheckLength --> |No| ContinueLoop
CheckSpace --> |No| SingleToggle["element.classList.toggle(classes, !!force)"]
SetClassName --> End([End])
ReturnEmpty --> End
ClearClassName --> End
ToggleClass --> End
SingleToggle --> End
```

**Diagram sources**
- [classlist.ts](file://src/utils/classlist.ts#L5-L55)

**Section sources**
- [classlist.ts](file://src/utils/classlist.ts#L5-L55)
- [setters.ts](file://src/utils/setters.ts#L565-L587)

## Style Handling

The style handling utilities in Woby provide comprehensive support for CSS property manipulation and style merging. The framework includes both direct style property setting through the `setNestedAttribute` function and stylesheet management utilities for constructed stylesheets.

The `convertAllDocumentStylesToConstructed` function enables shadow DOM integration by converting existing document stylesheets into ConstructedStyleSheet objects that can be adopted by shadow roots. This function implements caching to avoid redundant processing and includes automatic cache invalidation when stylesheet changes are detected.

```mermaid
sequenceDiagram
participant Client as "Application Code"
participant StylesheetUtil as "Stylesheet Utility"
participant DOM as "Document Object Model"
participant Cache as "Cache System"
Client->>StylesheetUtil : convertAllDocumentStylesToConstructed()
StylesheetUtil->>Cache : cachedConstructedSheets available?
alt Cache hit
Cache-->>StylesheetUtil : Return cached sheets
StylesheetUtil-->>Client : CSSStyleSheet[]
else Cache miss
Cache-->>StylesheetUtil : No cache available
StylesheetUtil->>DOM : Iterate document.styleSheets
loop For each stylesheet
StylesheetUtil->>DOM : Access cssRules
StylesheetUtil->>StylesheetUtil : Concatenate rule CSS
StylesheetUtil->>StylesheetUtil : Create new CSSStyleSheet
StylesheetUtil->>StylesheetUtil : Apply rules with replaceSync
StylesheetUtil->>StylesheetUtil : Add to constructedSheets
end
StylesheetUtil->>Cache : Store in cachedConstructedSheets
StylesheetUtil-->>Client : CSSStyleSheet[]
end
Client->>StylesheetUtil : observeStylesheetChanges()
StylesheetUtil->>StylesheetUtil : Setup MutationObserver
StylesheetUtil->>DOM : Observe document.head and document
Note over StylesheetUtil,DOM : Observer clears cache on changes
```

**Diagram sources**
- [stylesheets.ts](file://src/utils/stylesheets.ts#L29-L59)
- [nested.ts](file://src/utils/nested.ts#L61-L103)

**Section sources**
- [stylesheets.ts](file://src/utils/stylesheets.ts#L29-L59)
- [nested.ts](file://src/utils/nested.ts#L61-L103)
- [string.ts](file://src/utils/string.ts#L10-L25)

## DOM Manipulation Utilities

The DOM manipulation utilities in Woby provide efficient methods for direct DOM updates, including attribute setting, event handling, and child node management. The `setAttributeStatic` and `setAttribute` functions handle both static and reactive attribute updates, with special handling for boolean attributes and SVG elements.

The implementation includes optimizations for common cases and proper normalization of attribute names. For SVG elements, attribute names are normalized to handle camel-cased attributes correctly. Boolean attributes are handled according to HTML specifications, where the presence of the attribute (regardless of value) indicates truthiness.

```mermaid
flowchart TD
Start([setAttributeStatic]) --> CheckNested["key.includes('.') || key.includes('$')?"]
CheckNested --> |Yes| SetNested["setNestedAttribute(element, key, value)"]
CheckNested --> |No| CheckSVG["isSVG(element)?"]
CheckSVG --> |Yes| NormalizeSVG["normalizeKeySvg(key)"]
NormalizeSVG --> CheckNil["isNil(value) || (value === false && attributesBoolean.has(key))?"]
CheckNil --> |Yes| RemoveAttr["element.removeAttribute(key)"]
CheckNil --> |No| SetAttrSVG["element.setAttribute(key, String(value))"]
CheckSVG --> |No| CheckNilNormal["isNil(value) || (value === false && attributesBoolean.has(key))?"]
CheckNilNormal --> |Yes| RemoveAttrNormal["element.removeAttribute(key)"]
CheckNilNormal --> |No| PrepareValue["value = (value === true) ? '' : String(value)"]
PrepareValue --> SetAttrNormal["element.setAttribute(key, value)"]
SetNested --> End([End])
RemoveAttr --> End
SetAttrSVG --> End
RemoveAttrNormal --> End
SetAttrNormal --> End
```

**Diagram sources**
- [setters.ts](file://src/utils/setters.ts#L5-L799)
- [nested.ts](file://src/utils/nested.ts#L61-L103)

**Section sources**
- [setters.ts](file://src/utils/setters.ts#L5-L799)
- [lang.ts](file://src/utils/lang.ts#L150-L170)

## Nested Property Support

The nested property utilities enable setting deeply nested properties through HTML attributes using either dot notation or dollar sign notation. The `normalizePropertyPath` function converts attribute names like "style$font-size" or "nested.prop.value" into normalized paths with camelCase conversion for each segment.

The `setNestedAttribute` function handles the actual setting of nested properties, with special handling for style properties and creation of intermediate objects as needed. This allows developers to bind directly to nested data structures without requiring flattening or additional processing.

```mermaid
classDiagram
class normalizePropertyPath {
+normalizePropertyPath(path : string) : string
-Converts $ to .
-Splits by .
-Applies kebabToCamelCase to each part
-Joins with .
}
class setNestedAttribute {
+setNestedAttribute(element : HTMLElement, attributeName : string, value : any) : void
-Handles style.* properties
-Creates nested object structure
-Sets final property value
}
class kebabToCamelCase {
+kebabToCamelCase(str : string) : string
-Converts hyphenated to camelCase
}
normalizePropertyPath --> setNestedAttribute : "used by"
kebabToCamelCase --> normalizePropertyPath : "used by"
kebabToCamelCase --> setNestedAttribute : "used by"
```

**Diagram sources**
- [nested.ts](file://src/utils/nested.ts#L30-L42)
- [nested.ts](file://src/utils/nested.ts#L61-L103)
- [string.ts](file://src/utils/string.ts#L10-L15)

**Section sources**
- [nested.ts](file://src/utils/nested.ts#L30-L103)
- [string.ts](file://src/utils/string.ts#L10-L35)

## Practical Examples

The Woby utilities support complex class expressions and style bindings through reactive values and conditional logic. Developers can use arrays, objects, and functions to define dynamic class lists and style properties. The framework automatically handles updates when reactive values change, ensuring the DOM stays in sync with application state.

For class management, objects can be used where keys are class names and values are boolean conditions. Arrays can contain mixed content including strings, reactive values, and nested arrays. Functions can return any of these types, enabling complex conditional logic.

```mermaid
flowchart TD
Start([Complex Class Expression]) --> ObjectSyntax["Object Syntax Example"]
ObjectSyntax --> DefineObject["{ active: isActive(), disabled: isDisabled() }"]
DefineObject --> ProcessObject["setClasses processes object"]
ProcessObject --> AddActive["Add 'active' if isActive() truthy"]
ProcessObject --> AddDisabled["Add 'disabled' if isDisabled() truthy"]
Start --> ArraySyntax["Array Syntax Example"]
ArraySyntax --> DefineArray["[ 'base', isActive() && 'active', isPremium() ? 'premium' : 'basic' ]"]
DefineArray --> ProcessArray["setClasses processes array"]
ProcessArray --> FlattenArray["Flatten nested arrays"]
FlattenArray --> FilterFalsy["Filter out falsy values"]
FilterArray --> AddClasses["Add remaining strings as classes"]
Start --> FunctionSyntax["Function Syntax Example"]
FunctionSyntax --> DefineFunction["() => ({ active: user.isActive, theme: user.theme })"]
DefineFunction --> ProcessFunction["setClasses resolves function"]
ProcessFunction --> Subscribe["Subscribe to reactive dependencies"]
Subscribe --> UpdateOnChange["Re-evaluate on changes"]
AddActive --> End([Classes Applied])
AddDisabled --> End
AddClasses --> End
UpdateOnChange --> End
```

**Diagram sources**
- [setters.ts](file://src/utils/setters.ts#L565-L587)
- [classlist.ts](file://src/utils/classlist.ts#L5-L55)

**Section sources**
- [setters.ts](file://src/utils/setters.ts#L451-L563)
- [resolvers.ts](file://src/utils/resolvers.ts#L10-L50)

## Performance Considerations

The Woby utilities are designed with performance as a primary concern, implementing multiple optimization strategies to minimize unnecessary DOM operations and memory usage. The class management system includes fast paths for common scenarios like empty className or exact matches, avoiding the overhead of classList operations when direct assignment suffices.

The stylesheet utilities implement aggressive caching with automatic invalidation, preventing redundant processing of CSS rules. The constructed stylesheet cache is automatically cleared when DOM mutations are detected in the document head, ensuring styles remain up-to-date without requiring manual cache management.

```mermaid
flowchart LR
A[Performance Optimizations] --> B[Class Management]
A --> C[Stylesheet Handling]
A --> D[Attribute Setting]
A --> E[Nested Properties]
B --> B1["Optimized path for empty className"]
B --> B2["Direct assignment when possible"]
B --> B3["Batch operations for multiple classes"]
C --> C1["Cached constructed sheets"]
C --> C2["Automatic cache invalidation"]
C --> C3["MutationObserver for changes"]
C --> C4["Error handling for cross-origin"]
D --> D1["Boolean attribute optimization"]
D --> D2["SVG attribute normalization"]
D --> D3["Reactive update batching"]
E --> E1["Path normalization cache"]
E --> E2["Incremental object creation"]
E --> E3["Direct property access"]
```

**Diagram sources**
- [classlist.ts](file://src/utils/classlist.ts#L5-L55)
- [stylesheets.ts](file://src/utils/stylesheets.ts#L29-L59)
- [setters.ts](file://src/utils/setters.ts#L5-L799)

**Section sources**
- [classlist.ts](file://src/utils/classlist.ts#L5-L55)
- [stylesheets.ts](file://src/utils/stylesheets.ts#L1-L115)
- [setters.ts](file://src/utils/setters.ts#L1-L799)

## Best Practices

When using Woby's utility functions, several best practices can help maximize performance and maintainability. For class management, prefer object syntax for conditional classes and avoid unnecessary re-renders by structuring reactive dependencies appropriately. Use the array syntax when combining static and dynamic classes.

For style handling, leverage the nested property syntax to bind directly to component state without intermediate processing. When working with constructed stylesheets, call `observeStylesheetChanges()` early in the application lifecycle to ensure automatic cache invalidation.

```mermaid
flowchart TD
Start([Best Practices]) --> ClassManagement["Class Management"]
Start --> StyleHandling["Style Handling"]
Start --> DOMUpdates["DOM Updates"]
Start --> NestedProps["Nested Properties"]
ClassManagement --> CM1["Use object syntax for conditional classes"]
ClassManagement --> CM2["Prefer arrays for mixed static/dynamic"]
ClassManagement --> CM3["Avoid complex expressions in templates"]
ClassManagement --> CM4["Structure reactive dependencies carefully"]
StyleHandling --> SH1["Use constructed stylesheets for shadow DOM"]
StyleHandling --> SH2["Call observeStylesheetChanges() early"]
StyleHandling --> SH3["Handle cross-origin stylesheet errors"]
StyleHandling --> SH4["Cache stylesheet results when possible"]
DOMUpdates --> DU1["Use reactive setters for dynamic attributes"]
DOMUpdates --> DU2["Handle SVG attributes appropriately"]
DOMUpdates --> DU3["Batch related DOM operations"]
DU1 --> DU3
NestedProps --> NP1["Use $ or . notation for nested properties"]
NestedProps --> NP2["Normalize attribute names consistently"]
NP1 --> NP2
NP2 --> NP3["Handle style properties specially"]
CM1 --> End([Effective Usage])
CM2 --> End
CM3 --> End
CM4 --> End
SH1 --> End
SH2 --> End
SH3 --> End
SH4 --> End
DU1 --> End
DU2 --> End
DU3 --> End
NP1 --> End
NP2 --> End
NP3 --> End
```

**Diagram sources**
- [setters.ts](file://src/utils/setters.ts#L565-L587)
- [stylesheets.ts](file://src/utils/stylesheets.ts#L70-L85)
- [nested.ts](file://src/utils/nested.ts#L61-L103)

**Section sources**
- [setters.ts](file://src/utils/setters.ts#L1-L799)
- [stylesheets.ts](file://src/utils/stylesheets.ts#L70-L115)
- [nested.ts](file://src/utils/nested.ts#L1-L103)