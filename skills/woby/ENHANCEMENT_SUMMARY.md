# Woby Skill Enhancement Summary

## What Was Added

Enhanced the `/woby` skill with comprehensive **step-by-step guide for upgrading TSX components to Web Components**.

## Key Sections Added

### 1. Step-by-Step Upgrade Process

**Step 1: Add defaults() wrapper**
- Wrap component with defaults() to provide default props
- **CRITICAL**: All defaults MUST use $() wrapper for reactivity
- Shows correct vs incorrect patterns

**Step 2: Add type converters**
- HTML attributes are strings → need type converters
- Import from `D:\Developments\tslib\@woby\woby\src\html`:
  - `HtmlNumber` - converts "5" → 5
  - `HtmlBoolean` - converts "true" → true
  - `HtmlDate` - converts date strings
  - `HtmlBigInt` - converts bigint strings
  - `HtmlObject` - JSON serialization
- Custom converters with `toHtml`/`fromHtml` options

**Step 3: Register as CustomElement**
- Call `customElement()` in SAME file (not new file)
- Add TypeScript declarations for JSX support
- Use kebab-case for element name

**Step 4: Wire observables to inner component**
- Observables from defaults() automatically wired to props
- Use direct observable `{count}` (reactive)
- Use function expression `{() => $$(count)}` (reactive)
- Avoid direct unwrap `{$$(count)}` (not reactive)

**Step 5: Use in HTML and JSX**
- HTML: attributes are strings
- JSX: observables allowed
- Nested props: use `$` separator
- Style props: use `$` separator

**Step 6: Test attribute reactivity**
- Use `setAttribute()` to test updates
- Verify shadow DOM content

### 2. Complete Examples

**Counter Web Component**
- Full example showing all steps
- HtmlNumber for numeric attributes
- Event handlers updating observables

**Slot Content (Children)**
- How to use `{children}` for slot content
- HTML usage with nested elements

**Context Integration**
- createContext() and useContext()
- Provider pattern in custom elements

**Style Encapsulation**
- Shadow DOM with automatic stylesheet adoption
- `ignoreStyle` option to prevent adoption

**Nested Props**
- Nested object properties
- `$` separator in HTML attributes

**Custom Serialization**
- JSON.stringify/parse for objects
- Custom `toHtml`/`fromHtml` converters

### 3. Common Pitfalls

1. Missing $() in defaults → non-reactive attributes
2. Missing HtmlNumber → number stays as string
3. Direct unwrap {$$(count)} → runs once only
4. Wrong file for registration → must be same file
5. Kebab-case in JSX → use camelCase or $ separator

## Implementation Details

### Type Converters (from html/)

**HtmlNumber** (`html-number.ts`):
```typescript
const HtmlNumber: ObservableOptions<number> = {
  type: Number,
  toHtml: (value) => isNaN(Number(value)) ? undefined : String(value),
  fromHtml: (value) => Number(value)
}
```

**HtmlBoolean** (`html-boolean.ts`):
- Converts "true", "1", "" → true
- Everything else → false

**HtmlObject** (`html-object.ts`):
- Uses JSON.stringify/parse
- Custom converters override defaults

### defaults() Implementation

From `defaults.ts`:
- Returns factory function with `[SYMBOL_DEFAULT]`
- Merges props with defaults using `assign()`
- Converts children to observable if not already
- Handles `ignoreStyle` for stylesheet adoption

### customElement() Implementation

From `custom_element.ts`:
- Creates browser custom element class
- Attaches shadow DOM (unless `three-*` element)
- Adopts stylesheets automatically
- Sets up MutationObserver for attribute changes
- Converts kebab-case to camelCase
- Handles nested properties with `$` separator
- Supports Context.Provider registration

## Files Referenced

- `D:\Developments\tslib\@woby\woby\src\methods\defaults.ts` - defaults() implementation
- `D:\Developments\tslib\@woby\woby\src\methods\custom_element.ts` - customElement() implementation
- `D:\Developments\tslib\@woby\woby\src\html\html-number.ts` - HtmlNumber converter
- `D:\Developments\tslib\@woby\woby\demo\playground\src\TestCustomElementComprehensive.tsx` - comprehensive example

## Key Insights

1. **defaults() is mandatory** - CustomElements require default props
2. **$() wrapper is critical** - Without it, attributes are non-reactive
3. **Type converters are essential** - HTML attributes are strings only
4. **Same file registration** - customElement() must be in component file
5. **Shadow DOM encapsulation** - Styles adopted automatically
6. **Nested props use $ separator** - `config$debug` in HTML/JSX
7. **Slot content via children** - `{children}` renders slot content

## Usage

The enhanced skill now provides:

1. ✅ Step-by-step upgrade process
2. ✅ Type converter usage guide
3. ✅ Observable wiring patterns
4. ✅ Complete examples for all scenarios
5. ✅ Common pitfalls and fixes
6. ✅ Implementation details from source code

Just invoke `/woby` when working with Woby framework or upgrading components to Web Components!