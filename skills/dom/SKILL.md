---
name: dom
description: 'Master DOM skill using @missbjs/dv CLI for professional-grade DOM design, debugging, theming, print layout, and responsive development. Use @missbjs/dv CLI for all browser interactions including console log/error/assert reading. Uses dv CLI built-in profiles (profile-1 through profile-6, ports 9230-9235) - run `dv profiles` to see available profiles. Always open HEADED mode for user inspection. Profile profile-1 is pinned for OAuth persistence. Automatically routes to appropriate sub-skills - dom-design for layout and UX design, dom-debug for debugging issues, dom-theme for color/font theming, dom-print for print media, dom-mobile for mobile-specific, dom-desktop for desktop-specific, dom-mobile-desktop for cross-device optimization. All sub-skills follow professional design workflow with verification and self-check to production level. **CRITICAL: Each agent must use a unique Chrome profile to avoid conflicts with other parallel agents. DO NOT use default port 9230 without checking availability. DO NOT close Chrome instances launched by other agents.**'
---

# DOM Master Skill (@missbjs/dv CLI)

Orchestrates specialized DOM sub-skills for professional-grade web development using @missbjs/dv CLI.

## ⚠️ CRITICAL: Parallel Agent Profile Management

**If you are running alongside other agents using this skill, you MUST coordinate Chrome profile usage to avoid conflicts.**

### Step 1: Determine Which Profile to Use

**Decision Tree - Answer these questions before launching Chrome:**

```
Q1: Is this task OAuth/authentication related?
    YES → Use profile-1 (port 9230) - preserves login state
    NO  → Continue to Q2

Q2: Are other agents currently using Chrome profiles?
    How to check:
    - Look for running Chrome processes with remote debugging
    - Check ports 9230-9235 for active connections
    - Review any coordination notes from other agents
    
    IF unsure → Assume other agents are using profiles 1-3, use profiles 4-6
    
Q3: Which profiles are available?
    Check each port sequentially using @missbjs/dv status:
    - Port 9230: dv status --profile profile-1
    - Port 9231: dv status --profile profile-2
    - ... through port 9235

    IF command lists pages → Profile is IN USE by another agent
    IF command fails/no Chrome running → Profile is AVAILABLE
    
Q4: Select the first available profile:
    - Priority order: profile-2 → profile-3 → profile-4 → profile-5 → profile-6
    - (Skip profile-1 unless OAuth needed)
    
Q5: Document your profile choice:
    Tell the user: "Using Chrome profile-X on port 923X"
    This helps other agents know which profiles are taken
```

### Step 2: Check Port Availability BEFORE Launching

**MANDATORY: Check if the port is already in use before launching Chrome.**

```bash
# Use @missbjs/dv status to check if Chrome is running
dv status --profile profile-1  # For profile 1
dv status --profile profile-2  # For profile 2
# ... etc for ports 9232-9235

# IF the command lists pages → Chrome is running on this port (IN USE)
# IF the command shows "Chrome is not running" → Port is AVAILABLE
```

**What to do if port is in use:**

1. **DO NOT close the existing Chrome instance** - it belongs to another agent
2. **DO NOT kill the process** - you will break the other agent's work
3. **Choose a different profile** - try the next port in sequence
4. **If all ports are in use** - inform the user and wait, or coordinate with other agents

### Step 3: Launch Chrome with Your Chosen Profile

**Once you've verified the port is available, launch Chrome using @missbjs/dv:**

```bash
# Install @missbjs/dv globally (if not already installed)
npm install -g @missbjs/dv

# Example for Profile 3 (port 9232)
dv start --profile profile-2 --headed

# Example for Profile 1 (port 9230) - OAuth
dv start --profile profile-2 --headed
```

**Verify Chrome started successfully:**

```bash
# Check Chrome status
dv status --profile profile-3

# Should list open pages
```

### Step 4: Use the Correct Port for All Commands

**Each profile uses a specific port for all @missbjs/dv commands:**

| Profile | Port | Purpose |
|---------|------|---------|
| profile-1 | 9230 | General use |
| profile-2 | 9231 | Parallel testing |
| profile-3 | 9232 | Parallel testing |
| profile-4 | 9233 | Parallel testing |
| profile-5 | 9234 | Parallel testing |
| profile-6 | 9235 | Parallel testing |

**All @missbjs/dv commands require --profile parameter to prevent agent collisions.**

### Absolute Rules for Parallel Agents

1. **✅ DO** check port availability before launching Chrome
2. **✅ DO** use a unique profile not used by other agents
3. **✅ DO** tell the user which profile you're using
4. **✅ DO** coordinate with other agents if all ports are busy
5. **❌ DO NOT** use port 9230 by default without checking
6. **❌ DO NOT** close Chrome instances launched by other agents
7. **❌ DO NOT** kill Chrome processes that are using other ports
8. **❌ DO NOT** assume profile-1 is available - it may be used for OAuth
9. **❌ DO NOT** create new profile names - use ONLY profile-1 through profile-6

### Parallel Agent Coordination Example

```
Agent A: "I need to test OAuth login. Checking port 9230..."
         [Checks port 9230 - available]
         "Using Chrome profile-1 on port 9230 for OAuth testing"
         [Launches Chrome on 9230]

Agent B: "I need to debug a layout issue. Checking ports..."
         [Checks port 9230 - IN USE by Agent A]
         [Checks port 9231 - available]
         "Using Chrome profile-2 on port 9231 for debugging"
         [Launches Chrome on 9231]

Agent C: "I need to test responsive design. Checking ports..."
         [Checks ports 9230, 9231 - IN USE]
         [Checks port 9232 - available]
         "Using Chrome profile-3 on port 9232"
         [Launches Chrome on 9232]
```

**All three agents work simultaneously without conflicts!**

## When to Use

Use this master skill when you need comprehensive DOM work that includes:
- Design and layout creation
- Debugging and fixing issues
- Theme and styling
- Print media optimization
- Mobile/desktop responsiveness
- Viewport and zoom management
- Unified pointer interactions (mouse/touch)
- Scroll gesture handling
- Intelligent blur dismissal
- Animation and transitions
- Virtual scrolling and performance optimization
- Form validation and input handling
- Drag and drop interactions
- Event simulation and DOM evaluation
- Production-level quality with verification
- **TSX component and CustomElement testing with attribute reactivity verification**
- **Console log/error/assert reading via MCP tools**

## Chrome DevTools CLI Setup

**CRITICAL**: @missbjs/dv CLI requires Chrome to be launched with remote debugging enabled.

### Hardcoded Chrome Profiles (CRITICAL - DO NOT CHANGE)

**MANDATORY**: Use ONLY these 6 hardcoded Chrome profiles. DO NOT create new profiles or use arbitrary names.

```bash
const CHROME_PROFILES = {
  profile__1: 'profile-1',  // General use (preserve login state)
  profile__2: 'profile-2',  // Parallel testing profile
  profile__3: 'profile-3',  // Parallel testing profile
  profile__4: 'profile-4',  // Parallel testing profile
  profile__5: 'profile-5',  // Parallel testing profile
  profile__6: 'profile-6',  // Parallel testing profile
}
```

**Rules**:
1. **ALWAYS use one of these 6 profile names** when configuring Chrome DevTools MCP
2. **profile-1 is pinned for OAuth** - preserve login state, DO NOT clear cookies/session
3. **Use profile-2 through profile-6 for parallel testing** - these can be cleared/reset
4. **DO NOT create new profile names** - agents will be blamed if they use profiles not in this list
5. **This saves disk space** and prevents profile proliferation
6. **Each agent must use a unique profile** to avoid conflicts with parallel agents

### Port Mapping (MEMORIZE THIS)

```
Profile          Port    Purpose
─────────────────────────────────────────────
profile-1   9230    OAuth pinned (preserve login state)
profile-2   9231    Parallel testing
profile-3   9232    Parallel testing
profile-4   9233    Parallel testing
profile-5   9234    Parallel testing
profile-6   9235    Parallel testing
```

### Launch Chrome with Remote Debugging

**MANDATORY**: Before using @missbjs/dv CLI, launch Chrome with remote debugging and a specific profile:

```bash
# Install @missbjs/dv globally (if not already installed)
npm install -g @missbjs/dv

# Profile 1 (general use) - port 9230
dv start --profile profile-1 --headed

# Profile 2 (parallel testing) - port 9231
dv start --profile profile-2 --headed

# Profile 3 (parallel testing) - port 9232
dv start --profile profile-3 --headed

# Profile 4 (parallel testing) - port 9233
dv start --profile profile-4 --headed

# Profile 5 (parallel testing) - port 9234
dv start --profile profile-5 --headed

# Profile 6 (parallel testing) - port 9235
dv start --profile profile-6 --headed
```

### Why @missbjs/dv CLI over agent-browser

- ✅ **Console Access**: Native console command to read log/error/assert messages
- ✅ **CLI Integration**: Command-line tool, no MCP server setup required
- ✅ **Debugging Power**: Full access to Runtime, Console, Network, and other CDP domains
- ✅ **Official Protocol**: Uses Chrome's official debugging protocol
- ✅ **Profile Management**: Built-in profile system for consistent testing
- ✅ **Parallel Agent Support**: Each profile can be used independently without conflicts
- ✅ **Mandatory Port Parameter**: Prevents agent collisions by requiring explicit port

### ALWAYS Open in HEADED Mode

**CRITICAL**: Always open Chrome in headed mode (visible browser window) for user inspection.

```bash
// When navigating pages, ALWAYS use headed mode
navigate_page({ url: "http://localhost:3000", headed: true })

// User will randomly inspect browsers - keep them visible
```

**NO headless mode** - user needs to see and inspect browsers at any time.

### CRITICAL: Use Tailwind CSS Classes in HTML, NOT Inline Styles

**ALWAYS use Tailwind CSS utility classes directly in HTML elements, NOT inline `style` attributes.**

```html
<!-- ✅ CORRECT: Use Tailwind classes inline in HTML -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
    <div class="p-6">
      Content
    </div>
  </div>
</div>

<!-- ❌ WRONG: Never use inline style attributes -->
<div style="position: fixed; inset: 0; z-index: 50; ...">
  Content
</div>
```

## @missbjs/dv CLI Commands

The @missbjs/dv CLI provides these commands:

### Navigation & Page Management
```bash
# List all pages
dv pages --profile profile-1

# Select page by URL (via pages command)
dv pages --profile profile-1

# Navigate to URL (ALWAYS headed)
dv navigate --profile profile-1 --url http://localhost:3000/page

# Create new page
dv new --profile profile-1 --url http://localhost:3000

# Check Chrome status
dv status --profile profile-1

# Close page
dv close --profile profile-1 --page-id <page-id>
```

### Console Reading (CRITICAL)

**MANDATORY**: Use dv console command for reading console.log, console.error, and console.assert messages.

```bash
# List all console messages
dv console --profile profile-1

# Filter by type
dv console --profile profile-1 --type error
dv console --profile profile-1 --type log
dv console --profile profile-1 --type warn

# JSON output for programmatic access
dv console --profile profile-1 --json
```

**Why dv console over eval script**:
- ✅ **Native Integration**: Direct access to Chrome's Console domain
- ✅ **No Script Injection**: Doesn't pollute page context
- ✅ **All Message Types**: Captures log, error, warn, assert automatically
- ✅ **Timestamped**: Provides precise timing information
- ✅ **Source Location**: Shows file URL and line number

### Inspection & Evaluation
```bash
# Execute JavaScript (for DOM inspection, NOT console reading)
dv eval --profile profile-1 --script "document.title"

# Check styles
dv eval --profile profile-1 --script "
(() => {
  const el = document.querySelector('.target');
  const styles = getComputedStyle(el);
  return {
    display: styles.display,
    position: styles.position,
    zIndex: styles.zIndex
  };
})()
"

# Take snapshot (text-based accessibility tree)
dv snapshot --profile profile-1

# Take screenshot (visual inspection)
dv screenshot --profile profile-1 --output screenshot.png
```

### Interaction
```bash
# Click element by selector
dv click --profile profile-1 --selector "#button"

# Fill input
dv fill --profile profile-1 --selector "#email" --value "test@example.com"

# Type text
dv type --profile profile-1 --selector "#input" --value "typing content"

# Press key
dv key --profile profile-1 --key Enter
```

## Sub-Skills Architecture

The DOM ecosystem consists of specialized skills that work together:

### 1. `/dom-design` - Layout & UX Design
**Purpose**: Design DOM layouts with professional UX patterns
**Capabilities**:
- Layout architecture (flexbox, grid, container queries)
- Component design patterns
- UX optimization
- Accessibility-first design
- Design system integration
- Wireframe to implementation

**Workflow**:
1. Analyze requirements and constraints
2. Design layout hierarchy
3. Choose responsive patterns
4. Implement with semantic HTML
5. Verify accessibility
6. Self-check against design principles

### 2. `/dom-debug` - Debugging & Fixing
**Purpose**: Debug and fix DOM issues systematically
**Capabilities**:
- Visibility debugging (z-index, overflow, viewport)
- Layout debugging (positioning, sizing, alignment)
- Style debugging (CSS conflicts, specificity)
- Performance debugging (layout thrashing, reflows)
- Cross-browser debugging
- **Console log/error/assert reading via MCP tools**
- **Chrome DevTools MCP integration (MANDATORY)**

**Workflow**:
1. **Choose unique profile** - check port availability, avoid conflicts with other agents
2. **Launch Chrome with @missbjs/dv**: Use dv start --profile profile-X --headed
3. **Open page HEADED**: `dv navigate --profile profile-X --url <url>`
4. **Read console logs**: `dv console --profile profile-X --type error`
5. **Inspect element**: `dv eval --profile profile-X --script "..."` with `getComputedStyle(element)`
6. **Compare intended vs actual** behavior
7. **Identify root cause** from actual runtime data
8. **Propose fix with approval**
9. **Apply and verify** using @missbjs/dv commands again
10. **Document solution**

**CRITICAL**: Do NOT guess or assume. Always use @missbjs/dv CLI to:
- Read console.log and console.error messages via dv console
- Check actual DOM state with dv eval
- Inspect computed styles
- Verify event listeners
- Test fixes in real browser context

### 3. `/dom-theme` - Color & Font Theming
**Purpose**: Design and implement cohesive themes
**Capabilities**:
- Color harmony algorithms (6 types)
- Palette generation with user choice
- Font consistency checking
- Dark/light theme generation
- Design token creation
- WCAG contrast verification

**Workflow**:
1. Analyze existing colors/fonts
2. Generate harmonious palette
3. Verify accessibility
4. Create design tokens
5. Implement theme variables
6. Test across components

### 4. `/dom-print` - Print Media Optimization
**Purpose**: Optimize layouts for print media
**Capabilities**:
- A4/page sizing
- Page break logic
- Print margin optimization
- Element hiding (nav, buttons, links)
- Content reflow for print
- Dynamic page sizing
- Binder margin support

**Workflow**:
1. Analyze print requirements
2. Design print layout
3. Configure page breaks
4. Hide non-print elements
5. Test in DevTools print mode
6. Verify across paper sizes

### 5. `/dom-mobile` - Mobile Optimization
**Purpose**: Optimize for mobile devices
**Capabilities**:
- Touch target sizing (44x44px min)
- Viewport optimization
- Mobile-first responsive design
- Touch gesture support
- Performance optimization
- PWA considerations

**Workflow**:
1. Analyze mobile requirements
2. Design touch-friendly interface
3. Optimize viewport
4. Test on mobile viewports
5. Verify touch targets
6. Test on real devices

### 6. `/dom-desktop` - Desktop Optimization
**Purpose**: Optimize for desktop experience
**Capabilities**:
- Keyboard navigation
- Mouse interaction optimization
- Large screen layout
- Multi-column layouts
- Desktop performance
- Window responsiveness

**Workflow**:
1. Analyze desktop requirements
2. Design keyboard-friendly interface
3. Optimize for large screens
4. Test keyboard navigation
5. Verify mouse interactions
6. Test across resolutions

### 7. `/dom-mobile-desktop` - Cross-Device Optimization
**Purpose**: Ensure seamless experience across all devices
**Capabilities**:
- Responsive design patterns
- Device-agnostic components
- Progressive enhancement
- Adaptive loading
- Universal accessibility
- Performance budgets

**Workflow**:
1. Analyze device requirements
2. Design responsive architecture
3. Implement mobile-first
4. Enhance for desktop
5. Test across breakpoints
6. Verify universal access

### 8. `/dom-customelement` - CustomElement/Web Component Testing
**Purpose**: Test TSX components and CustomElements with attribute reactivity verification
**Capabilities**:
- Convert JSX/TSX to CustomElements using Woby
- Test attribute initialization and reactivity
- Detect missing $() bugs in defaults()
- Verify setAttribute() updates
- Test type handling (HtmlNumber for numbers)
- Shadow DOM serialization with getInnerHTML()
- Automated snapshot testing with TestSnapshots

**Workflow**:
1. Analyze component props and types
2. Add defaults() wrapper with reactive $()
3. Register as CustomElement
4. Test initial attribute values
5. Verify setAttribute() reactivity
6. Check type conversions
7. Validate shadow DOM rendering

**CRITICAL**: Use this sub-skill when testing CustomElements to catch bugs where attributes are set but don't appear in components due to missing $() in defaults().

### 9. `/dom-portal` - Portal Patterns
**Purpose**: Comprehensive Portal patterns for modals, dropdowns, sidebars, and nested components
**Capabilities**:
- Basic Modal Portal (single-layer)
- Dual-Layer Portal (Sidebar + Overlay)
- Bottom Sheet Portal (Wheeler-style)
- Nested Popup with cancelOnBlur
- Conditional Visibility with Portal
- Z-index hierarchy strategy
- Portal vs CSS positioning tradeoffs

**Workflow**:
1. Identify if Portal is needed (escaping overflow, z-index stacking)
2. Choose Portal pattern based on use case
3. Apply z-index hierarchy
4. Handle nested component dismissal (cancelOnBlur)
5. Verify with Chrome DevTools MCP

**CRITICAL**: Use this sub-skill when creating modals, dropdowns, sidebars, or any component that needs to escape its DOM hierarchy.

## Professional Design Workflow

All sub-skills follow this professional workflow:

### Phase 1: Design
- Analyze requirements
- Research best practices
- Design solution
- Plan implementation

### Phase 2: Implement
- Write semantic HTML
- **Apply Tailwind CSS utility classes (NOT inline styles)**
- Add interactions
- Ensure accessibility

### Phase 3: Verify
- Test functionality
- Check accessibility
- Verify performance
- Cross-browser test

### Phase 4: Self-Check
- Review against requirements
- Check design principles
- Validate code quality
- Ensure production-ready

### Phase 5: Document
- Document decisions
- Record patterns used
- Note edge cases
- Create maintenance guide

## Common Workflows

### Debug a Layout Issue
```bash
# 1. Launch Chrome with unique profile (HEADED mode)
dv start --profile profile-2 --headed

# 2. Navigate to page
dv navigate --profile profile-2 --url http://localhost:3000/page

# 3. Read console messages
dv console --profile profile-2 --type error

# 4. Inspect the element
dv eval --profile profile-2 --script "
(() => {
  const el = document.querySelector('.problem-element');
  const styles = getComputedStyle(el);
  return {
    element: el.tagName,
    classes: el.className,
    computedStyles: {
      display: styles.display,
      position: styles.position,
      width: styles.width,
      height: styles.height,
      zIndex: styles.zIndex,
      overflow: styles.overflow
    },
    boundingRect: el.getBoundingClientRect()
  };
})()
"

# 5. Fix the issue in code
# 6. Verify the fix (navigate again or reload)
dv navigate --profile profile-2 --url http://localhost:3000/page

# 7. Check console for errors after fix
dv console --profile profile-2 --type error
```

### Capture All Console Errors
```bash
# Launch Chrome and navigate
dv start --profile profile-2 --headed
dv navigate --profile profile-2 --url http://localhost:3000

# List all console messages
dv console --profile profile-2

# Filter by type (error, log, warn)
dv console --profile profile-2 --type error
dv console --profile profile-2 --type log
dv console --profile profile-2 --type warn

# JSON output for parsing
dv console --profile profile-2 --json
```

### Enumerate All Colors
```bash
dv start --profile profile-2 --headed
dv navigate --profile profile-2 --url http://localhost:3000

dv eval --profile profile-2 --script "
(() => {
  const colors = { all: new Set() };
  document.querySelectorAll('*').forEach(el => {
    const c = getComputedStyle(el);
    if (c.color && c.color !== 'rgba(0, 0, 0, 0)') colors.all.add(c.color);
    if (c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)') colors.all.add(c.backgroundColor);
  });
  return Array.from(colors.all);
})()
"
```

### Test Responsive Design
```bash
# Launch Chrome and navigate
dv start --profile profile-2 --headed
dv navigate --profile profile-2 --url http://localhost:3000

# Resize to mobile viewport
dv resize --profile profile-2 --width 375 --height 667

# Check element visibility
dv eval --profile profile-2 --script "
(() => {
  return {
    mobileMenuVisible: document.querySelector('.mobile-menu').offsetWidth > 0,
    sidebarWidth: document.querySelector('.sidebar').offsetWidth
  };
})()
"
```

## Iterative Debugging Loop

The debugging process is iterative: diagnose, fix, verify, repeat until the issue is resolved.

### The Fix → Debug → Verify Loop

**Phase 1: Initial Diagnosis**
```bash
// Navigate to page (HEADED, hardcoded profile)
navigate_page({ url: "http://localhost:3000", headed: true })

// Read console messages via MCP tools
const consoleMessages = list_console_messages()
console.log("Console messages:", consoleMessages)

// Inspect element
evaluate_script({
  script: `
    (() => {
      const el = document.querySelector('.problem-element');
      const styles = getComputedStyle(el);
      return {
        element: el.tagName,
        classes: el.className,
        computedStyles: {
          display: styles.display,
          position: styles.position,
          width: styles.width,
          height: styles.height,
          zIndex: styles.zIndex,
          overflow: styles.overflow
        },
        boundingRect: el.getBoundingClientRect()
      };
    })()
  `
})
```

**Phase 2: Apply Fix**
- **ALWAYS use Tailwind classes directly in HTML, NOT inline `style` attributes**
- Save changes to source files
- Reload: `navigate_page({ url: "http://localhost:3000", headed: true })`

**Phase 2.5: Verify Console After Reload (MANDATORY)**
**After reloading the page, ALWAYS check the console via MCP tools.**

```bash
// List console messages via MCP
const newConsoleMessages = list_console_messages()

// Filter errors
const errors = newConsoleMessages.filter(msg => msg.type === "error")

// Check if fix applied
evaluate_script({
  script: `
    (() => {
      return {
        hasErrors: ${errors.length} > 0,
        fixApplied: document.querySelector('.problem-element') !== null
      };
    })()
  `
})
```

**Phase 3: Verify Fix**
```bash
evaluate_script({
  script: `
    (() => {
      const el = document.querySelector('.problem-element');
      return {
        isVisible: el.offsetWidth > 0 && el.offsetHeight > 0,
        rect: el.getBoundingClientRect()
      };
    })()
  `
})
```

## TailwindCSS Integration

**MANDATORY**: All DOM work MUST use Tailwind CSS classes directly in HTML, NOT inline `style` attributes.

### Simple Approach: Tailwind Classes in HTML

**Just use Tailwind classes directly in your HTML elements** - no need to create separate CSS files or define custom class names.

```html
<!-- ✅ CORRECT: Tailwind classes inline in HTML -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto p-6">
    Content
  </div>
</div>

<!-- ❌ WRONG: Never use inline style attributes -->
<div style="position: fixed; inset: 0; z-index: 50; ...">
  Content
</div>
```

### TailwindCSS-Aware Implementation

All sub-skills are TailwindCSS-aware:
- **Use Tailwind classes directly in HTML elements** (simple, no extra files needed)
- **NEVER use inline `style` attributes** - always use Tailwind utility classes
- Check `tailwind.config.js` for custom values and design tokens
- Use responsive variants (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- Use state variants (`hover:`, `focus:`, `active:`, `disabled:`)

### Common Tailwind Patterns

**Layout**:
- `flex` → `display: flex`
- `items-center` → `align-items: center`
- `justify-between` → `justify-content: space-between`
- `grid grid-cols-3` → `display: grid; grid-template-columns: repeat(3, 1fr)`

**Spacing**:
- `p-4` → `padding: 1rem`
- `m-2` → `margin: 0.5rem`
- `gap-4` → `gap: 1rem`

**Colors**:
- `bg-blue-500` → `background-color: #3b82f6`
- `text-white` → `color: white`
- `border-gray-300` → `border-color: #d1d5db`

**Typography**:
- `text-xl` → `font-size: 1.25rem`
- `font-bold` → `font-weight: 700`
- `text-center` → `text-align: center`

**Visibility & Display**:
- `hidden` → `display: none`
- `visible` → `visibility: visible`
- `block` → `display: block`
- `inline` → `display: inline`

**Positioning**:
- `relative` → `position: relative`
- `absolute` → `position: absolute`
- `fixed` → `position: fixed`
- `top-0 left-0` → `top: 0; left: 0`
- `z-10` → `z-index: 10`

## Styling Components: cls and class Props

**No inline styles.** Woby components are styled exclusively via `cls` and `class` props (Tailwind classes only). Never pass a `style` attribute or object to a Woby component.

### cls vs class Contract

| Prop | Purpose | Behavior |
|------|---------|----------|
| `cls` | Consumer's override classes | **Replaces** the component's built-in default classes |
| `class` | Consumer's append classes | **Added on top of** the component's built-in default classes |

Both props must be declared as `$()` in `defaults()` so HTML attribute changes stay reactive.

### Component Implementation Pattern

```tsx
const MyComponent = defaults(() => ({
    cls: $('') as ObservableMaybe<string>,   // override — replaces defaults
    class: $('') as ObservableMaybe<string>,  // append — adds to defaults
}), (props) => {
    const { cls, class: className, children } = props

    // cls ?? 'defaults' means: use cls if truthy, else keep built-in classes
    return (
        <div class={[() => $$(cls) ?? 'default-base p-4', className]}>
            {children}
        </div>
    )
})
```

### Consumer Usage

```tsx
// cls overrides built-in classes entirely
<my-comp cls="bg-red-100 p-4" />
// Result: "bg-red-100 p-4"  (no "default-base p-4")

// class appends to built-in classes
<my-comp class="mt-4 shadow-lg" />
// Result: "default-base p-4 mt-4 shadow-lg"

// Both together
<my-comp cls="full-override" class="addon-class" />
// Result: "full-override addon-class"
```

### Targeting Child Elements via Tailwind Arbitrary Selectors

Use Tailwind's `[&_tag]` / `[&>tag]` syntax inside `class` or `cls` to style descendant or direct-child elements — no need for separate CSS rules.

| Selector | Targets | Example |
|----------|---------|---------|
| `[&_tag]` | All descendants matching `tag` | `[&_td]:p-2` — all `<td>` inside |
| `[&>tag]` | Direct children matching `tag` | `[&>tr]:hover:bg-amber-50` — direct `<tr>` children |

```tsx
// Style table internals from outside the component
<my-table class="[&_td]:border [&_td]:border-gray-400 [&>thead]:bg-gray-50" />

// Override + style children
<my-table cls="[&_td]:p-2 [&>tr]:hover:bg-amber-50" />
```

**Shadow DOM note:** The selector classes must be on the **inner element** (inside shadow DOM), not just on the host. Woby adopts document stylesheets into shadow DOM via `adoptedStyleSheets`, so `[&_td]:p-2` on an inner `<table>` correctly reaches `<td>` elements inside the shadow root.

## Automatic Skill Routing

The master skill automatically routes to appropriate sub-skills based on context:

**Routing Logic**:
```
IF designing new layout → /dom-design
IF debugging existing issue → /dom-debug
IF theming/styling → /dom-theme
IF print media → /dom-print
IF mobile-only optimization → /dom-mobile
IF desktop-only optimization → /dom-desktop
IF cross-device → /dom-mobile-desktop
IF CustomElement/Web Component testing → /dom-customelement
IF attribute reactivity issues → /dom-customelement
IF Portal/modal/sidebar/dropdown → /dom-portal
IF multiple concerns → combine sub-skills
```

## Getting Started

When you invoke this master skill, it will:
1. **Check for parallel agents** and choose a unique profile
2. **Verify port availability** before launching Chrome
3. **Launch Chrome** with the chosen profile
4. **Connect via MCP** using the correct server
5. Analyze your request
6. Route to appropriate sub-skills
7. Execute professional workflow
8. Verify and self-check
9. Produce production-ready output

Just describe what you need, and the DOM ecosystem will handle the rest!

---

## WUI Component Patterns

Patterns extracted from the wui component library for reference.

### Focus Blur Handling with Timeout

When handling focus loss in custom elements, use setTimeout to allow focus transfer:

```tsx
const handleBlur = (e?: FocusEvent) => {
    setTimeout(() => {
        const nextFocusedElement = e?.relatedTarget as Node;
        const containerEl = $$(container);

        const isFocusStillInside =
            (containerEl && containerEl.contains(document.activeElement)) ||
            (containerEl && containerEl.contains(nextFocusedElement));

        if (!isFocusStillInside) {
            isEditing(false);
        }
    }, 50);
};
```

### MouseDown to Prevent Focus Loss

Use onMouseDown with preventDefault() to keep focus on editor when interacting with dropdowns:

```tsx
<div
    onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();  // Prevents editor from losing focus
    }}
>
    {/* dropdown content */}
</div>
```

### Event StopImmediatePropagation for Toggle Buttons

For toggle buttons with checked state:

```tsx
onClick={(e) => {
    if (onClick) onClick(e);
    e.stopImmediatePropagation();  // Prevents other handlers + bubbling
    if (isObservable(checked)) {
        checked(!$$(checked));
    }
}}
```

### Viewport Handling with useViewportSize

Always use `useViewportSize` from `@woby/use` for reactive viewport dimensions:

```tsx
import { useViewportSize } from '@woby/use';

const { height: vh, width: vw, offsetLeft: ol, offsetTop: ot } = useViewportSize();

// Use $$(vh) and $$(vw) in reactive contexts
```

### Z-Index Layers (WUI Standard)

```
z-5     - Background overlay (behind modals)
z-10    - Secondary overlays, masks
z-50    - Standard popups, tooltips
z-100   - Standard modals
z-200   - Bottom sheets, drawers (Wheeler)
z-1000  - App bars, fixed navigation
z-[150] - Wheeler widget container
z-[200] - Wheeler content
```