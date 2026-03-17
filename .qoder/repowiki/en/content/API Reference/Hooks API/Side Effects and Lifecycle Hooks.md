# Side Effects and Lifecycle Hooks

<cite>
**Referenced Files in This Document**  
- [use_effect.ts](file://src/hooks/use_effect.ts)
- [use_render_effect.ts](file://src/hooks/use_render_effect.ts)
- [use_attached.ts](file://src/hooks/use_attached.ts)
- [use_mounted_context.ts](file://src/hooks/use_mounted_context.ts)
- [use_event_listener.ts](file://src/hooks/use_event_listener.ts)
- [use_fetch.ts](file://src/hooks/use_fetch.ts)
- [use_animation_frame.ts](file://src/hooks/use_animation_frame.ts)
- [use_interval.ts](file://src/hooks/use_interval.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [use_effect: General Side Effects](#use_effect-general-side-effects)
3. [use_render_effect: Pre-Paint Effects](#use_render_effect-pre-paint-effects)
4. [Common Use Cases](#common-use-cases)
5. [Managing Subscriptions and Cleanup](#managing-subscriptions-and-cleanup)
6. [Common Pitfalls and Best Practices](#common-pitfalls-and-best-practices)
7. [Conclusion](#conclusion)

## Introduction
Woby provides a comprehensive system for managing side effects and component lifecycle through a suite of specialized hooks. These hooks enable developers to interact with external systems, manipulate the DOM, manage subscriptions, and respond to rendering cycles with precision. This document details the core lifecycle hooks—`use_effect` and `use_render_effect`—and demonstrates their appropriate usage, integration patterns, and performance considerations.

## use_effect: General Side Effects
The `use_effect` hook is the primary mechanism for executing side effects after component rendering. It runs asynchronously after the browser has painted, making it ideal for operations that do not require immediate DOM layout access, such as logging, analytics, or non-critical API calls.

Effects created with `use_effect` are automatically cleaned up when the component unmounts or when dependencies change, preventing memory leaks. The cleanup function is returned from the effect callback and is invoked before the next effect runs or on unmount.

```mermaid
sequenceDiagram
participant Component
participant useEffect
participant Browser
participant Cleanup
Component->>useEffect : Render completes
useEffect->>Browser : Wait for paint
Browser-->>useEffect : Paint complete
useEffect->>useEffect : Run effect callback
useEffect->>Cleanup : Schedule cleanup (if returned)
Cleanup->>useEffect : Execute on unmount or re-run
```

**Diagram sources**
- [use_effect.ts](file://src/hooks/use_effect.ts)

**Section sources**
- [use_effect.ts](file://src/hooks/use_effect.ts)

## use_render_effect: Pre-Paint Effects
Unlike `use_effect`, the `use_render_effect` hook runs synchronously before the browser performs layout and paint. This makes it suitable for operations that require reading layout information or making DOM mutations that affect rendering, such as measuring elements or updating styles that impact layout.

Internally, `use_render_effect` leverages the same underlying `useEffect` primitive but configures it with a `sync: 'init'` option to ensure execution before paint. This guarantees that any DOM changes made within the effect are reflected in the current frame.

```mermaid
sequenceDiagram
participant Component
participant useRenderEffect
participant Browser
Component->>useRenderEffect : Render completes
useRenderEffect->>useRenderEffect : Run effect immediately
useRenderEffect->>Browser : DOM mutations applied
Browser->>Browser : Layout and paint
```

**Diagram sources**
- [use_render_effect.ts](file://src/hooks/use_render_effect.ts)

**Section sources**
- [use_render_effect.ts](file://src/hooks/use_render_effect.ts)

## Common Use Cases

### Managing Subscriptions
Hooks like `use_event_listener` and `use_interval` abstract common subscription patterns. They automatically manage subscription lifecycle, ensuring cleanup on unmount.

```mermaid
sequenceDiagram
participant Component
participant useEventListener
participant DOM
participant Cleanup
Component->>useEventListener : Mount with target, event, handler
useEventListener->>DOM : Add event listener
DOM->>Component : Event fired
Component->>Component : Handler executes
Component->>Cleanup : Unmount
Cleanup->>DOM : Remove event listener
```

**Section sources**
- [use_event_listener.ts](file://src/hooks/use_event_listener.ts)

### Animations and Layout Effects
`use_animation_frame` schedules callbacks to run before the next repaint, ideal for smooth animations. It integrates with Woby's scheduler system and ensures automatic disposal.

```mermaid
sequenceDiagram
participant Component
participant useAnimationFrame
participant Browser
Component->>useAnimationFrame : Request animation frame
useAnimationFrame->>Browser : requestAnimationFrame
Browser->>useAnimationFrame : Frame callback
useAnimationFrame->>Component : Execute animation logic
Component->>useAnimationFrame : Schedule next frame or stop
```

**Section sources**
- [use_animation_frame.ts](file://src/hooks/use_animation_frame.ts)

### External API Integration
`use_fetch` provides a reactive wrapper around the Fetch API, integrating with `useAbortSignal` for cancellation and `useResource` for state management. It ensures requests are canceled if the component unmounts.

```mermaid
sequenceDiagram
participant Component
participant useFetch
participant AbortSignal
participant Network
Component->>useFetch : Request and init
useFetch->>AbortSignal : Create signal from init.signal
useFetch->>Network : fetch(request, { signal })
Network-->>useFetch : Response stream
useFetch-->>Component : Resource<Response>
Component->>useFetch : Unmount
useFetch->>AbortSignal : Abort request
```

**Section sources**
- [use_fetch.ts](file://src/hooks/use_fetch.ts)

## Managing Subscriptions and Cleanup
Woby's effect system emphasizes automatic cleanup through observable teardown. Every effect and subscription returns a disposer function that is automatically invoked when the component unmounts or dependencies change.

This prevents common issues like memory leaks and stale subscriptions. Developers should always return a cleanup function from effects that register listeners, intervals, or other resources.

```mermaid
flowchart TD
Effect["Effect Callback"] --> Register["Register Resource"]
Register --> Return["Return Cleanup Function"]
Return --> Woby["Woby Runtime"]
Woby --> Condition{"Component Unmounts<br/>or Dependencies Change?"}
Condition --> |Yes| Execute["Execute Cleanup"]
Condition --> |No| Wait["Wait for next trigger"]
Execute --> Release["Release Resources"]
```

**Section sources**
- [use_effect.ts](file://src/hooks/use_effect.ts)
- [use_event_listener.ts](file://src/hooks/use_event_listener.ts)
- [use_interval.ts](file://src/hooks/use_interval.ts)

## Common Pitfalls and Best Practices

### Avoiding Infinite Loops
Ensure effect dependencies are stable. Avoid creating new objects or functions in dependency arrays unless necessary. Use `useMemo` or `useCallback` to memoize dependencies.

### Timing Effects Correctly
Use `use_effect` for post-render operations and `use_render_effect` only when layout access is required. Misusing `use_render_effect` can lead to performance issues due to synchronous execution.

### Integrating with External APIs
Always handle cancellation via `AbortSignal` when making network requests. Use `useResource` to manage loading, error, and success states consistently.

## Conclusion
Woby's lifecycle hooks provide a robust foundation for managing side effects, DOM interactions, and context propagation. By leveraging automatic cleanup, reactive observables, and precise timing controls, developers can build efficient, maintainable components that integrate seamlessly with both the DOM and external systems.