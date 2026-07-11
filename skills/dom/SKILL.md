---
name: dom
description: 'Master DOM skill using @missbjs/dv1-6 CLI for professional-grade DOM design, debugging, theming, print layout, and responsive development. Use dv1-6 CLI for all browser interactions including console log/error/assert reading. Each dv binary manages its own Chrome profile (dv1-dv6). Always open HEADED mode for user inspection. Vite workflow: `pnpm dev --port <port>` ONCE (HMR, pick port NOT in 5xxx), then dv* navigate to it. If 404 → restart dev. If reload loop → kill all ports spawned under this session. Automatically routes to appropriate sub-skills — dom-design for layout and UX design, dom-debug for debugging issues, dom-theme for color/font theming, dom-print for print media, dom-mobile for mobile-specific, dom-desktop for desktop-specific, dom-mobile-desktop for cross-device optimization. All sub-skills follow professional design workflow with verification and self-check to production level. **CRITICAL: Each agent must use a unique dv binary to avoid conflicts with other parallel agents. DO NOT use default dv1 without checking availability. DO NOT close Chrome instances launched by other agents.**'
---

# DOM Master Skill (@missbjs/dv1-6 CLI)

Orchestrates specialized DOM sub-skills for professional-grade web development using @missbjs/dv1-6 CLI.

## ⚠️ CRITICAL: Parallel Agent Profile Management

**If you are running alongside other agents using this skill, you MUST coordinate Chrome profile usage to avoid conflicts.**

### Step 1: Determine Which Profile to Use

**Decision Tree - Answer these questions before launching Chrome:**

```
Q1: Is this task OAuth/authentication related?
    YES → Use dv1
    NO  → Continue to Q2

Q2: Are other agents currently using Chrome profiles?
    How to check:
    - Look for running Chrome processes with remote debugging
    - Review any coordination notes from other agents
    
    IF unsure → Assume other agents are using dv1-dv3, use dv4-dv6
    
Q3: Which profiles are available?
    Check each sequentially using dv* status:
    dv1 status
    dv2 status
    dv3 status
    dv4 status
    dv5 status
    dv6 status

    IF command lists pages → Profile is IN USE by another agent
    IF command fails/no Chrome running → Profile is AVAILABLE
    
Q4: Select the first available profile:
    - Priority order: dv2 → dv3 → dv4 → dv5 → dv6
    - (Skip dv1 unless OAuth needed)
    
Q5: Document your profile choice:
    Tell the user: "Using dvX"
    This helps other agents know which profiles are taken
```

### Step 2: Check Availability BEFORE Launching

**MANDATORY: Check if the profile is already in use before launching Chrome.**

```bash
dv1 status
dv2 status
dv3 status
dv4 status
dv5 status
dv6 status

# IF the command lists pages → Chrome is running on this profile (IN USE)
# IF the command shows "Chrome is not running" → Profile is AVAILABLE
```

**What to do if profile is in use:**

1. **DO NOT close the existing Chrome instance** - it belongs to another agent
2. **DO NOT kill the process** - you will break the other agent's work
3. **Choose a different profile** - try the next one in sequence
4. **If all profiles are in use** - inform the user and wait, or coordinate with other agents

### Step 3: Launch Chrome

**Once you've verified the profile is available, launch Chrome:**

```bash
dv2 start --headed
dv3 start --headed
dv4 start --headed
dv5 start --headed
dv6 start --headed
```

**Verify Chrome started successfully:**

```bash
dv2 status

# Should list open pages
```

### Step 4: Available Profiles

| Command | Purpose |
|---------|---------|
| dv1 | OAuth/authentication |
| dv2 | Parallel testing |
| dv3 | Parallel testing |
| dv4 | Parallel testing |
| dv5 | Parallel testing |
| dv6 | Parallel testing |

### Absolute Rules for Parallel Agents

1. **✅ DO** check availability before launching Chrome
2. **✅ DO** use a unique profile not used by other agents
3. **✅ DO** tell the user which profile you're using
4. **✅ DO** coordinate with other agents if all profiles are busy
5. **❌ DO NOT** use dv1 by default without checking
6. **❌ DO NOT** close Chrome instances launched by other agents
7. **❌ DO NOT** kill Chrome processes started by other agents
8. **❌ DO NOT** assume dv1 is available - it may be in use for OAuth

### Parallel Agent Coordination Example

```
Agent A: "I need to test OAuth login. Checking dv1..."
         [dv1 status - available]
         "Using dv1 for OAuth testing"
         [Launches Chrome: dv1 start --headed]

Agent B: "I need to debug a layout issue. Checking profiles..."
         [dv1 - IN USE by Agent A]
         [dv2 - available]
         "Using dv2 for debugging"
         [Launches Chrome: dv2 start --headed]

Agent C: "I need to test responsive design. Checking profiles..."
         [dv1, dv2 - IN USE]
         [dv3 - available]
         "Using dv3"
         [Launches Chrome: dv3 start --headed]
```

**All three agents work simultaneously without conflicts!**

---

## Vite Dev Server Workflow (HMR)

When testing Vite-based projects (JS/TS/Node packages), follow this workflow:

### Start the Dev Server (ONCE per session)

```bash
# Pick a random port (NOT in 5xxx range — avoid collisions with common ports)
# e.g. 7214, 8362, 9451. Use the same port for all dv* navigate commands.
pnpm dev --port 7214
```

**Rules:**
- **Start ONCE only** — Vite uses HMR (Hot Module Replacement). After `pnpm dev`, code changes auto-reload the page. No need to restart.
- **Only restart if:**
  1. The dev server **crashes** (process exits)
  2. Chrome shows a **404** when navigating → the dev server wasn't ready or crashed
- **Do NOT restart** for normal code changes — HMR handles them.

### Navigate with dv*

```bash
# After pnpm dev is running, point Chrome to it
# Use the SAME port you started pnpm dev with
dv3 navigate --url http://localhost:7214
```

### Handling 404

If `dv* navigate` to the dev server URL results in a 404:
1. The dev server may have crashed or not started yet
2. **Run `pnpm dev` again** in the project directory
3. Wait for the "ready in" message
4. Navigate again with `dv*`

### Handling Reload Loops

**If Chrome shows a continuous reload loop** (page keeps refreshing without settling):

```bash
# Kill ALL port spawns under this AI session
# Find Chrome processes started by this session's dv* instances
# and kill them by port
Get-Process -Name chrome | Where-Object { $_.CommandLine -match "remote-debugging-port=(923[0-5])" } | Stop-Process -Force
```

Then:
1. Restart the Chrome instances you need (after checking ports are free)
2. Restart `pnpm dev` if needed
3. Navigate again

**Why this happens:** Vite's HMR can enter a loop when the WebSocket connection is unstable or the page has a circular module dependency. The Chrome instance gets stuck in a reload cycle. Killing the port frees the Chrome instance so you can start fresh.

---

## When to Use

Use this master skill when you need comprehensive DOM work that includes:
- Design and layout creation
- Debugging and fixing issues
- Theme and styling
- Print media optimization
- Mobile/desktop responsiveness
- TSX component and CustomElement testing with attribute reactivity verification
- Console log/error/assert reading via dv* commands
- Vite dev server testing with HMR

---

## Chrome DevTools CLI Setup

**CRITICAL**: @missbjs/dv CLI requires Chrome to be launched with remote debugging enabled.

### Available Profiles (CRITICAL - DO NOT CHANGE)

**Use ONLY these 6 dv profiles. DO NOT create new profiles.**

```bash
dv1  # OAuth/authentication
dv2  # Parallel testing
dv3  # Parallel testing
dv4  # Parallel testing
dv5  # Parallel testing
dv6  # Parallel testing
```

**Rules**:
1. **ALWAYS use one of these 6 dv binaries**
2. **dv1 is for OAuth** - preserve login state, DO NOT clear cookies/session
3. **Use dv2 through dv6 for parallel testing** - these can be cleared/reset
4. **DO NOT create new profiles** - agents will be blamed if they use profiles not in this list
5. **Each agent must use a unique profile** to avoid conflicts with parallel agents

### Why @missbjs/dv CLI over agent-browser

- ✅ **Console Access**: Native console command to read log/error/assert messages
- ✅ **CLI Integration**: Command-line tool, no MCP server setup required
- ✅ **Debugging Power**: Full access to Runtime, Console, Network, and other CDP domains
- ✅ **Official Protocol**: Uses Chrome's official debugging protocol
- ✅ **Profile Management**: Built-in profile system for consistent testing
- ✅ **Parallel Agent Support**: Each profile can be used independently without conflicts
- ✅ **Auto-injected profile**: `dv1`-`dv6` wrappers handle profile management automatically

### ALWAYS Open in HEADED Mode

**CRITICAL**: Always open Chrome in headed mode (visible browser window) for user inspection.

```bash
# When navigating pages, ALWAYS use headed mode
dv3 start --headed
dv3 navigate --url http://localhost:7214

# User will randomly inspect browsers - keep them visible
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

---

## @missbjs/dv CLI Commands

The `dv1`-`dv6` CLI provides these commands. Each binary manages its own profile automatically — just use the right binary name.

### Navigation & Page Management
```bash
# List all pages
dv3 pages

# Select page by URL
dv3 pages

# Navigate to URL (ALWAYS headed)
dv3 navigate --url http://localhost:7214/page

# Create new page
dv3 new --url http://localhost:7214

# Check Chrome status
dv3 status

# Close page
dv3 close --page-id <page-id>
```

### Console Reading (CRITICAL)

**MANDATORY**: Use `dv* console` command for reading console.log, console.error, and console.assert messages.

```bash
# List all console messages
dv3 console

# Filter by type
dv3 console --type error
dv3 console --type log
dv3 console --type warn

# JSON output for programmatic access
dv3 console --json
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
dv3 eval --script "document.title"

# Check styles
dv3 eval --script "
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
dv3 snapshot

# Take screenshot (visual inspection)
dv3 screenshot --output screenshot.png
```

### Interaction
```bash
# Click element by selector
dv3 click --selector "#button"

# Fill input
dv3 fill --selector "#email" --value "test@example.com"

# Type text
dv3 type --selector "#input" --value "typing content"

# Press key
dv3 key --key Enter
```

---

## Vite Dev Server + dv* Workflow (Quick Reference)

This is the complete workflow for testing a Vite-based project:

```bash
# ── Step 1: Start Vite dev server (ONCE per session) ──
# Pick a random port (NOT in 5xxx range — avoid collisions with common ports)
# e.g. 7214, 8362, 9451. Use the same port for all dv* navigate commands.
pnpm dev --port 7214

# ── Step 2: Start Chrome (ONCE per session) ──
dv2 start --headed

# ── Step 3: Navigate to the dev server (use SAME port as Step 1) ──
dv2 navigate --url http://localhost:7214

# ── Step 4: Read console output ──
dv2 console --type error
dv2 console --type log

# ── Step 5: Make code changes ──
# HMR auto-reloads. No need to restart dv navigate.
# Just re-read console after changes:
dv2 console --type error

# ── Step 6: If 404 ──
# The dev server may have crashed. Restart it:
# pnpm dev --port 7214
# Then navigate again:
# dv2 navigate --url http://localhost:7214

# ── Step 7: If reload loop ──
# Kill all Chrome instances spawned by this session:
# (PowerShell)
Get-Process -Name chrome | Where-Object { $_.CommandLine -match "remote-debugging-port=(923[0-5])" } | Stop-Process -Force
# Then restart from Step 2.
```

---

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
- **Console log/error/assert reading via dv* commands**
- **Chrome DevTools MCP integration (MANDATORY)**

**Workflow**:
1. **Choose unique profile** - check availability, avoid conflicts with other agents
2. **Start Vite dev server** (if not already running): `pnpm dev --port 7214`
3. **Launch Chrome**: `dv2 start --headed`
4. **Open page HEADED**: `dv2 navigate --url http://localhost:7214`
5. **Read console logs**: `dv2 console --type error`
6. **Inspect element**: `dv2 eval --script "..."` with `getComputedStyle(element)`
7. **Compare intended vs actual** behavior
8. **Identify root cause** from actual runtime data
9. **Propose fix with approval**
10. **Apply fix** (HMR auto-reloads)
11. **Verify** using `dv2 console --type error` and `dv2 eval` again
12. **Document solution**

**CRITICAL**: Do NOT guess or assume. Always use dv* CLI to:
- Read console.log and console.error messages via `dv* console`
- Check actual DOM state with `dv* eval`
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
1. Start Vite dev server: `pnpm dev --port 7214`
2. Launch Chrome: `dv2 start --headed`
3. Navigate to playground: `dv2 navigate --url http://localhost:7214`
4. Analyze component props and types
5. Add defaults() wrapper with reactive $()
6. Register as CustomElement
7. Test initial attribute values: `dv2 console --type log`
8. Verify setAttribute() reactivity: `dv2 eval --script "..."` 
9. Check type conversions
10. Validate shadow DOM rendering

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
5. Verify with Chrome DevTools

**CRITICAL**: Use this sub-skill when creating modals, dropdowns, sidebars, or any component that needs to escape its DOM hierarchy.

---

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

---

## Common Workflows

### Debug a Layout Issue
```bash
# 1. Start Vite dev server (if not running)
# pnpm dev --port 7214

# 2. Launch Chrome with unique profile (HEADED mode)
dv2 start --headed

# 3. Navigate to page
dv2 navigate --url http://localhost:7214

# 4. Read console messages
dv2 console --type error

# 5. Inspect the element
dv2 eval --script "
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

# 6. Fix the issue in code (HMR auto-reloads)
# 7. Verify the fix
dv2 navigate --url http://localhost:7214

# 8. Check console for errors after fix
dv2 console --type error
```

### Capture All Console Errors
```bash
# Launch Chrome and navigate
dv2 start --headed
dv2 navigate --url http://localhost:7214

# List all console messages
dv2 console

# Filter by type (error, log, warn)
dv2 console --type error
dv2 console --type log
dv2 console --type warn

# JSON output for parsing
dv2 console --json
```

### Enumerate All Colors
```bash
dv2 start --headed
dv2 navigate --url http://localhost:7214

dv2 eval --script "
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
dv2 start --headed
dv2 navigate --url http://localhost:7214

# Resize to mobile viewport
dv2 resize --width 375 --height 667

# Check element visibility
dv2 eval --script "
(() => {
  return {
    mobileMenuVisible: document.querySelector('.mobile-menu').offsetWidth > 0,
    sidebarWidth: document.querySelector('.sidebar').offsetWidth
  };
})()
"
```

---

## Iterative Debugging Loop

The debugging process is iterative: diagnose, fix, verify, repeat until the issue is resolved.

### The Fix → Debug → Verify Loop

**Phase 1: Initial Diagnosis**
```bash
# Navigate to page (HEADED)
dv2 navigate --url http://localhost:7214

# Read console messages
dv2 console --type error

# Inspect element
dv2 eval --script "
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
```

**Phase 2: Apply Fix**
- **ALWAYS use Tailwind classes directly in HTML, NOT inline `style` attributes**
- Save changes to source files
- HMR auto-reloads the page
- Wait a moment for HMR to complete, then verify

**Phase 2.5: Verify Console After Reload (MANDATORY)**
**After the page reloads (via HMR), ALWAYS check the console.**

```bash
# List console messages
dv2 console --type error
```

**Phase 3: Verify Fix**
```bash
dv2 eval --script "
(() => {
  const el = document.querySelector('.problem-element');
  return {
    isVisible: el.offsetWidth > 0 && el.offsetHeight > 0,
    rect: el.getBoundingClientRect()
  };
})()
"
```

---

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

---

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

---

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

---

## Getting Started

When you invoke this master skill, it will:
1. **Check for parallel agents** and choose a unique profile
2. **Verify availability** before launching Chrome
3. **Start Vite dev server** (if testing a Vite project) with `pnpm dev --port <port>` (pick a random port, NOT in 5xxx)
4. **Launch Chrome** with the chosen profile (`dvX start --headed`)
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