# Double Child Issue Diagnosis

## Problem Description

When using the `jsx()` function incorrectly in Woby SSR, a "double child" issue occurs where child elements appear to be duplicated in the rendered output.

## Root Cause

The issue occurs when children are passed as a property in the props object instead of as separate arguments to the `jsx()` function.

### Incorrect Usage (Causes Double Child Issue):
```js
jsx('div', {
    children: [
        jsx('h1', { children: 'Direct Child 1' }),
        jsx('h2', { children: 'Direct Child 2' })
    ]
})
```

### Correct Usage:
```js
jsx('div', null,
    jsx('h1', null, 'Direct Child 1'),
    jsx('h2', null, 'Direct Child 2')
)
```

## Why This Happens

1. **In the incorrect usage:**
   - Children are passed as a `children` property in the props object
   - Each child element also has its own `children` property
   - When the renderer processes this, it sees both the children array and the individual children properties
   - This causes the children to be rendered twice - once from the array and once from their individual properties

2. **In the correct usage:**
   - Children are passed as separate arguments to the function
   - The `createElement` function properly handles these as rest parameters
   - Each child is only rendered once

## Technical Details

Looking at the `createElement` function in `create_element.ssr.ts`:

```ts
export const createElement = <P = { children?: Observable<Child> }>(
    component: Component<P>, 
    _props?: P | null, 
    ..._children: Child[]
) => {
    const children = _children.length > 1 ? _children : (_children.length > 0 ? _children[0] : undefined)
    const hasChildren = !isVoidChild(children)
    
    // ... 
    
    if (hasChildren && isObject(_props) && 'children' in _props) {
        throw new Error('Providing "children" both as a prop and as rest arguments is forbidden')
    }
    
    // ...
}
```

The function is designed to handle children in two ways:
1. As rest parameters (`..._children`)
2. As a `children` property in the props object

However, when both are used simultaneously, it throws an error. But in our incorrect usage, we're not hitting this error case because we're only using the props approach.

The issue is in how the renderer processes nested children when they're structured this way.

## Solution

Always use the correct signature for `jsx()`:
```js
jsx(component, props, ...children)
```

Instead of putting children in the props object, pass them as separate arguments.

## Example Fix

```js
// ❌ Incorrect - causes double child issue
const DirectTestBroken = () => {
    return jsx('div', {
        children: [
            jsx('h1', { children: 'Direct Child 1' }),
            jsx('h2', { children: 'Direct Child 2' })
        ]
    })
}

// ✅ Correct
const DirectTestFixed = () => {
    return jsx('div', null,
        jsx('h1', null, 'Direct Child 1'),
        jsx('h2', null, 'Direct Child 2')
    )
}
```