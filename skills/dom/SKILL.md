---
name: dom
description: 'Master DOM skill using agent-browser for professional-grade DOM design, debugging, theming, print layout, and responsive development. Use agent-browser eval/execute for all browser interactions instead of Chrome DevTools MCP. Multiple browser sessions become multiple tabs in agent-browser. Automatically routes to appropriate sub-skills - dom-design for layout and UX design, dom-debug for debugging issues, dom-theme for color/font theming, dom-print for print media, dom-mobile for mobile-specific, dom-desktop for desktop-specific, dom-mobile-desktop for cross-device optimization. All sub-skills follow professional design workflow with verification and self-check to production level.'
---

# DOM Master Skill (agent-browser)

Orchestrates specialized DOM sub-skills for professional-grade web development using agent-browser.

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

## agent-browser Setup

**CRITICAL**: agent-browser is already installed and ready to use. No MCP configuration needed!

### Why agent-browser over Chrome DevTools MCP

- ✅ **Stable**: No connection timeouts or MCP server issues
- ✅ **Fast**: Native Rust CLI, not Node.js wrapper
- ✅ **Simple**: No remote debugging port setup required
- ✅ **Multi-session**: Multiple browser sessions = multiple tabs (not separate Chrome instances)
- ✅ **Reliable**: Works consistently without configuration changes

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
<div style="position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5);">
  <div style="background: white; border-radius: 0.5rem; box-shadow: 0 10px 15px rgba(0,0,0,0.1); width: 100%; max-width: 42rem; max-height: 90vh; overflow: auto;">
    <div style="padding: 1.5rem;">
      Content
    </div>
  </div>
</div>
```

**Why Tailwind classes over inline styles**:
- ✅ **Maintainable**: Consistent design system across components
- ✅ **Responsive**: Easy to add responsive variants (`md:flex`, `lg:p-8`)
- ✅ **Performance**: Purged CSS, smaller bundle size
- ✅ **Developer Experience**: No need to write custom CSS
- ✅ **Design Tokens**: Uses predefined color palette, spacing scale
- ✅ **State Variants**: Hover, focus, active states built-in (`hover:bg-blue-600`)
- ✅ **Simple**: No need to create separate CSS files or class names

**Keep it simple**: Just use Tailwind classes directly in your HTML elements. No need to extract to CSS files unless you have a specific reason.

### Basic Usage

**DEFAULT: Always use `--headed` to see the browser window.** Only use headless mode when explicitly instructed.

```bash
# Open a page (DEFAULT: ALWAYS use --headed for visible browser window)
agent-browser open --headed http://localhost:3000

# Execute JavaScript
agent-browser eval "document.title"

# Read console logs
agent-browser eval "console.log output"

# Click elements using eval
agent-browser eval "document.querySelector('button').click()"

# Close browser
agent-browser close
```

**Headless mode (only when explicitly instructed):**
```bash
# Use --headed=false or omit --headed flag for headless (invisible browser)
agent-browser open http://localhost:3000  # Headless by default
# OR explicitly
agent-browser open --headed=false http://localhost:3000
```

## Daemon Lifecycle Rules (CRITICAL)

agent-browser runs a **persistent daemon**. Understanding this prevents hard-to-debug failures.

### Always Use `--session`
**MANDATORY**: Every `open` / `eval` / `close` must use `--session <name>`. Without it you share the default session and lose isolation.

```bash
# ✅ CORRECT — named session persists across calls
agent-browser --session my-component open --headed http://127.0.0.1:5178/page.html
agent-browser --session my-component eval "document.title"
agent-browser --session my-component close

# ❌ WRONG — no session name, shares daemon default
agent-browser open --headed http://localhost:5178/page.html
```

### Use `127.0.0.1` not `localhost`
After closing and restarting the daemon, `localhost` can fail with `ERR_NAME_NOT_RESOLVED`. Always use `127.0.0.1`:

```bash
# ✅ CORRECT
agent-browser --session s open --headed "http://127.0.0.1:5178/page.html"

# ❌ RISKY — fails after daemon restart on some systems
agent-browser --session s open --headed "http://localhost:5178/page.html"
```

### `--viewport` and `--headed` are Daemon-Level
These flags are **ignored** if the daemon is already running. To change them you must close ALL sessions and the daemon first:

```bash
# Step 1: close named sessions
agent-browser --session my-component close

# Step 2: close daemon
agent-browser close

# Step 3: reopen with new daemon options
agent-browser --session my-component open --headed --viewport 900x220 "http://127.0.0.1:5178/page.html"
```

### `window.resizeTo()` Does NOT Work
Browser security blocks programmatic window resize. Use the spacer+scroll trick instead to simulate a button near the viewport bottom:

```bash
agent-browser --session s eval "(() => {
  // Inject spacer above content so button is pushed near viewport bottom when scrolled
  const spacer = document.createElement('div')
  spacer.style.height = (visualViewport.height - 80) + 'px'
  document.body.insertBefore(spacer, document.body.firstChild)

  // Scroll to put button ~60px from viewport bottom
  const btn = document.querySelector('sy-element').shadowRoot.querySelector('button')
  const btnTop = btn.getBoundingClientRect().top + window.scrollY
  window.scrollTo(0, btnTop - visualViewport.height + 60)

  return {
    vpH: visualViewport.height,
    btnTopInVp: Math.round(btn.getBoundingClientRect().top),
    spaceBelow: Math.round(visualViewport.height - btn.getBoundingClientRect().bottom - 4)
  }
})()"
```

### Async Reactive Eval (Woby / Observable updates)
After clicking a button or calling `setAttribute()`, Woby's reactive updates are async. Always use a Promise with `setTimeout` to read state after the update settles:

```bash
agent-browser --session s eval "(() => {
  const el = document.querySelector('sy-element')
  el.setAttribute('value', '丙子')
  return new Promise(resolve => setTimeout(() => {
    const btn = el.shadowRoot.querySelector('button')
    const spans = btn.querySelectorAll('span')
    resolve({
      span0: { text: spans[0]?.textContent, color: getComputedStyle(spans[0]).color },
      span1: { text: spans[1]?.textContent, color: getComputedStyle(spans[1]).color }
    })
  }, 100))  // 100ms is enough for most Woby reactive updates
})()"
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
- **agent-browser integration (MANDATORY)**

**Workflow**:
1. **Open page with agent-browser**: `agent-browser open <url>`
2. **Read console logs**: `agent-browser eval "console.log output"` or check console.error
3. **Inspect element**: `agent-browser eval "getComputedStyle(element)"`
4. **Compare intended vs actual** behavior
5. **Identify root cause** from actual runtime data
6. **Propose fix with approval**
7. **Apply and verify** using agent-browser again
8. **Document solution**

**CRITICAL**: Do NOT guess or assume. Always use agent-browser to:
- Read console.log and console.error messages
- Check actual DOM state
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
5. Verify with agent-browser

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

## agent-browser Commands Reference

### Navigation
```bash
agent-browser open --headed <url>    # Open URL (DEFAULT: ALWAYS use --headed)
agent-browser close                  # Close browser
agent-browser tab new <url>          # New tab
agent-browser tab <id>               # Switch tab
agent-browser tab close <id>         # Close tab
```

**Note**: `--headed` is the default recommendation. Use headless mode only when explicitly instructed by the user.

### Inspection
```bash
agent-browser eval "script"        # Execute JavaScript
agent-browser eval "console.log(...)"  # Read console logs
agent-browser get text @e1         # Get element text
agent-browser get html @e1         # Get innerHTML
agent-browser get url              # Get current URL
```

### Interaction
```bash
agent-browser eval "document.querySelector('button').click()"  # Click element
agent-browser eval "element.click()"  # Click using eval
agent-browser fill @e1 "text"      # Fill input
agent-browser press Enter          # Press key
agent-browser scroll down 500      # Scroll page
```

### Debugging
```bash
agent-browser eval "console.log(...)"  # Check console
agent-browser eval "getComputedStyle(el)"  # Check styles
agent-browser eval "el.getBoundingClientRect()"  # Check layout
```

## Common Workflows

### Debug a Layout Issue
```bash
# 1. Open the page (DEFAULT: use --headed to see the browser)
agent-browser open --headed http://localhost:3000/page

# 2. Inspect the element
agent-browser eval "(() => {
  const el = document.querySelector('.problem-element');
  return {
    display: getComputedStyle(el).display,
    position: getComputedStyle(el).position,
    zIndex: getComputedStyle(el).zIndex,
    rect: el.getBoundingClientRect()
  };
})()"

# 3. Fix the issue in code
# 4. Verify the fix
agent-browser eval "getComputedStyle(document.querySelector('.problem-element'))"

# 5. Close
agent-browser close
```

### Enumerate All Colors
```bash
agent-browser open --headed http://localhost:3000  # DEFAULT: --headed to see browser
agent-browser eval "(() => {
  const colors = { text: [], bg: [], all: new Set() };
  document.querySelectorAll('*').forEach(el => {
    const c = getComputedStyle(el);
    if (c.color && c.color !== 'rgba(0, 0, 0, 0)') {
      colors.text.push(c.color);
      colors.all.add(c.color);
    }
    if (c.backgroundColor && c.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      colors.bg.push(c.backgroundColor);
      colors.all.add(c.backgroundColor);
    }
  });
  return Array.from(colors.all);
})()"
agent-browser close
```

### Test Responsive Design
```bash
# Open in mobile viewport — --viewport is DAEMON-LEVEL: only works on fresh daemon start
# Close all sessions first: agent-browser --session <name> close && agent-browser close
agent-browser --session mobile-test open --headed --viewport 375x667 http://127.0.0.1:3000

# Check element visibility
agent-browser --session mobile-test eval "document.querySelector('.mobile-menu').offsetWidth > 0"

# ❌ window.resizeTo() does NOT work — browser security blocks it
# agent-browser eval "window.resizeTo(1920, 1080)"  ← WRONG, always ignored

# ✅ To test a different viewport: close daemon and reopen with new --viewport
# agent-browser --session mobile-test close && agent-browser close
# agent-browser --session desktop-test open --headed --viewport 1920x1080 http://127.0.0.1:3000

# Check desktop layout
agent-browser --session mobile-test eval "document.querySelector('.sidebar').offsetWidth"

agent-browser close
```

## Iterative Debugging Loop

The debugging process is iterative: you diagnose, fix, verify, and repeat until the issue is resolved. Use `agent-browser eval` to check computed styles at each iteration.

### The Fix → Debug → Verify Loop

**Phase 1: Initial Diagnosis**
```bash
# Open the page (DEFAULT: use --headed for visible browser window)
agent-browser open --headed http://localhost:3000

# Check console for errors
agent-browser eval "(() => {
  // Capture console errors
  const errors = [];
  const originalError = console.error;
  console.error = function(...args) {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  return 'Monitoring console errors...';
})()"

# Inspect the problematic element's computed styles
agent-browser eval "(() => {
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
      margin: styles.margin,
      padding: styles.padding,
      border: styles.border,
      zIndex: styles.zIndex,
      overflow: styles.overflow,
      visibility: styles.visibility,
      opacity: styles.opacity
    },
    boundingRect: el.getBoundingClientRect(),
    parentStyles: el.parentElement ? getComputedStyle(el.parentElement) : null
  };
})()"
```

**Phase 2: Apply Fix**
- **ALWAYS use Tailwind CSS classes directly in HTML, NOT inline `style` attributes**
- Add Tailwind utility classes to HTML elements (e.g., `class="flex items-center justify-center"`)
- Save changes to source files
- If using hot reload, wait for page to update
- If no hot reload, refresh: `agent-browser eval "location.reload()"`

**Example - Correct Approach**:
```html
<!-- ✅ CORRECT: Tailwind classes inline in HTML -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto p-6">
    Content
  </div>
</div>

<!-- ❌ WRONG: Don't use inline styles -->
<div style="position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5);">
  <div style="background: white; border-radius: 0.5rem; box-shadow: 0 10px 15px rgba(0,0,0,0.1); width: 100%; max-width: 42rem; max-height: 90vh; overflow: auto; padding: 1.5rem;">
    Content
  </div>
</div>
```

**Phase 2.5: Verify Console After Reload (MANDATORY)**
**CRITICAL: After reloading the page, ALWAYS check the console to confirm the previous fix is working correctly.**

```bash
# Check console for errors after reload
agent-browser eval "console.log output"

# Check for JavaScript errors
agent-browser eval "(() => {
  // Check if page loaded successfully
  return {
    hasErrors: false,
    consoleMessages: 'Page loaded successfully',
    // Check if fix is working
    fixApplied: document.querySelector('.problem-element') !== null
  };
})()"

# If console shows errors, analyze them before proceeding
agent-browser eval "(() => {
  // Capture any new errors that appeared after reload
  const errors = [];
  // Check window.onerror
  if (window.onerror) {
    errors.push('Window onerror detected');
  }
  // Check for common error patterns
  const bodyText = document.body.innerText;
  const hasErrorText = bodyText.includes('Error') || bodyText.includes('Exception');
  return {
    hasErrors: hasErrorText,
    errorCount: errors.length,
    errors: errors
  };
})()"
```

**Why this step is mandatory**:
- ✅ **Confirms fix is working**: Verifies no new errors introduced
- ✅ **Prevents cascading issues**: Catch errors before they compound
- ✅ **Saves debugging time**: Don't proceed with broken state
- ✅ **Validates assumptions**: Ensure fix actually resolved the issue

**If console shows errors after reload**:
1. **STOP immediately** - Do not proceed to Phase 3
2. **Analyze the error** - Read the console message carefully
3. **Fix the new error** - Address the error before continuing
4. **Reload again** - Apply fix and reload
5. **Check console again** - Repeat until console is clean

**Phase 3: Verify Fix**
```bash
# Re-check computed styles after fix
agent-browser eval "(() => {
  const el = document.querySelector('.problem-element');
  const styles = getComputedStyle(el);
  return {
    // Check the specific properties you modified
    [property you fixed]: styles[property you fixed],
    // Compare to expected values
    matchesExpected: styles.width === 'expected value',
    // Check if issue is resolved
    isVisible: el.offsetWidth > 0 && el.offsetHeight > 0,
    isPositionedCorrectly: el.getBoundingClientRect().top > 0
  };
})()"

# Check console again for new errors
agent-browser eval "(() => {
  // Check if any new errors appeared
  return window.__lastConsoleErrors || [];
})()"
```

**Phase 4: Iterate if Not Fixed**

If the verification shows the issue persists:
1. **Analyze why the fix didn't work**: Use `agent-browser eval` to check if CSS is being overridden
   ```bash
   agent-browser eval "(() => {
     const el = document.querySelector('.problem-element');
     // Check CSS specificity and overrides
     const styles = getComputedStyle(el);
     const matchedCSSRules = window.getMatchedCSSRules(el);
     return {
       inlineStyles: el.style.cssText,
       computedValue: styles[property],
       matchedRules: matchedCSSRules ? matchedCSSRules.map(r => r.selectorText + ' { ' + r.style.cssText + ' }') : 'N/A'
     };
   })()"
   ```

2. **Try alternative fix**: Apply different CSS approach
3. **Verify again**: Re-run Phase 3 verification
4. **Repeat until resolved**: Continue loop until computed styles match expectations

### Example: Debugging a Hidden Element

**Problem**: Element `.my-button` is not visible

**Iteration 1 - Diagnosis**:
```bash
agent-browser open --headed http://localhost:3000
agent-browser eval "(() => {
  const btn = document.querySelector('.my-button');
  const styles = getComputedStyle(btn);
  return {
    display: styles.display,
    visibility: styles.visibility,
    opacity: styles.opacity,
    width: btn.offsetWidth,
    height: btn.offsetHeight,
    zIndex: styles.zIndex,
    position: styles.position,
    parentOverflow: btn.parentElement ? getComputedStyle(btn.parentElement).overflow : null
  };
})()"
# Result: { display: 'block', visibility: 'hidden', opacity: '1', ... }
```

**Iteration 1 - Fix**: Add Tailwind class `visible` (or remove `invisible` class)
```html
<!-- ✅ CORRECT: Use Tailwind classes -->
<button class="my-button visible">Click me</button>

<!-- ❌ WRONG: Don't use inline styles -->
<button class="my-button" style="visibility: visible">Click me</button>
```

**Iteration 1 - Verify Console After Reload**:
```bash
# Check console after applying fix and reloading
agent-browser eval "console.log output"

# Verify no errors and fix is applied
agent-browser eval "(() => {
  const btn = document.querySelector('.my-button');
  return {
    hasErrors: false,
    elementExists: btn !== null,
    fixApplied: btn.classList.contains('visible')
  };
})()"
# Result: { hasErrors: false, elementExists: true, fixApplied: true }
# ✅ Console is clean, proceed to verify fix
```

**Iteration 1 - Verify Fix**:
```bash
agent-browser eval "(() => {
  const btn = document.querySelector('.my-button');
  return {
    visibility: getComputedStyle(btn).visibility,
    isVisible: btn.offsetWidth > 0 && btn.offsetHeight > 0
  };
})()"
# Result: { visibility: 'visible', isVisible: true }
# ✅ Issue resolved!
```

### Example: Debugging Layout Overflow

**Problem**: Content is cut off

**Iteration 1 - Diagnosis**:
```bash
agent-browser eval "(() => {
  const container = document.querySelector('.container');
  const content = document.querySelector('.content');
  return {
    containerOverflow: getComputedStyle(container).overflow,
    containerHeight: getComputedStyle(container).height,
    contentHeight: content.scrollHeight,
    isOverflowing: content.scrollHeight > container.clientHeight
  };
})()"
# Result: { containerOverflow: 'hidden', contentHeight: '800px', containerHeight: '400px', isOverflowing: true }
```

**Iteration 1 - Fix**: Add Tailwind class `overflow-auto` (or change `overflow-hidden` to `overflow-auto`)
```html
<!-- ✅ CORRECT: Use Tailwind classes -->
<div class="container overflow-auto h-96">
  Content
</div>

<!-- ❌ WRONG: Don't use inline styles -->
<div class="container" style="overflow: auto; height: 24rem;">
  Content
</div>
```

**Iteration 1 - Verify Console After Reload**:
```bash
# Check console after applying fix and reloading
agent-browser eval "console.log output"

# Verify no errors and fix is applied
agent-browser eval "(() => {
  const container = document.querySelector('.container');
  return {
    hasErrors: false,
    elementExists: container !== null,
    fixApplied: container.classList.contains('overflow-auto')
  };
})()"
# Result: { hasErrors: false, elementExists: true, fixApplied: true }
# ✅ Console is clean, proceed to verify fix
```

**Iteration 1 - Verify Fix**:
```bash
agent-browser eval "(() => {
  const container = document.querySelector('.container');
  return {
    overflow: getComputedStyle(container).overflow,
    hasScrollbar: container.scrollHeight > container.clientHeight
  };
})()"
# Result: { overflow: 'auto', hasScrollbar: true }
# ✅ Scrollbar now available!
```

### Example: Debugging Modal Dialog Sizing

**Problem**: Modal dialog size doesn't fit content - content is cut off or too much empty space

**Iteration 1 - Diagnosis**:
```bash
agent-browser open --headed http://localhost:3000
agent-browser eval "(() => {
  const modal = document.querySelector('.modal-dialog');
  const content = document.querySelector('.modal-content');
  const styles = getComputedStyle(modal);
  return {
    // Modal dimensions
    modalWidth: styles.width,
    modalHeight: styles.height,
    modalMaxWidth: styles.maxWidth,
    modalMaxHeight: styles.maxHeight,

    // Content dimensions
    contentScrollHeight: content.scrollHeight,
    contentScrollWidth: content.scrollWidth,
    contentClientHeight: content.clientHeight,
    contentClientWidth: content.clientWidth,

    // Overflow behavior
    modalOverflow: styles.overflow,
    contentOverflow: getComputedStyle(content).overflow,

    // Positioning
    modalPosition: styles.position,

    // Is content overflowing?
    isContentOverflowing: content.scrollHeight > modal.clientHeight || content.scrollWidth > modal.clientWidth,

    // Is modal too large?
    hasExcessiveSpace: modal.clientHeight > content.scrollHeight * 1.5
  };
})()"
# Result: { modalWidth: '500px', modalHeight: '400px', contentScrollHeight: '800px', isContentOverflowing: true }
```

**Iteration 1 - Fix**: Adjust modal sizing with Tailwind classes
```html
<!-- ✅ CORRECT: Use Tailwind classes for flexible sizing -->
<div class="modal-dialog w-full max-w-2xl max-h-[90vh] overflow-auto">
  <div class="modal-content p-6">
    <!-- Content -->
  </div>
</div>

<!-- ❌ WRONG: Fixed dimensions with inline styles -->
<div class="modal-dialog" style="width: 500px; height: 400px; overflow: hidden;">
  <div class="modal-content">
    <!-- Content -->
  </div>
</div>
```

**Iteration 1 - Verify Console After Reload**:
```bash
# Check console after applying fix and reloading
agent-browser eval "console.log output"

# Verify no errors and fix is applied
agent-browser eval "(() => {
  const modal = document.querySelector('.modal-dialog');
  return {
    hasErrors: false,
    elementExists: modal !== null,
    fixApplied: modal.classList.contains('max-h-[90vh]') && modal.classList.contains('overflow-auto')
  };
})()"
# Result: { hasErrors: false, elementExists: true, fixApplied: true }
# ✅ Console is clean, proceed to verify fix
```

**Iteration 1 - Verify Fix**:
```bash
agent-browser eval "(() => {
  const modal = document.querySelector('.modal-dialog');
  const content = document.querySelector('.modal-content');
  return {
    modalHeight: getComputedStyle(modal).height,
    modalMaxHeight: getComputedStyle(modal).maxHeight,
    contentFits: content.scrollHeight <= modal.clientHeight,
    hasScrollbar: content.scrollHeight > modal.clientHeight
  };
})()"
# Result: { modalHeight: '90vh', contentFits: true, hasScrollbar: true }
# ✅ Modal now adapts to content with scroll!
```

### Common Modal Sizing Issues

**Issue 1: Fixed height cutting off content**
- **Problem**: `h-96` (fixed 24rem height) cuts off content
- **Fix**: Use `max-h-[90vh] overflow-auto` for responsive max height with scroll

**Issue 2: Modal too small for content**
- **Problem**: `max-w-sm` (max-width: 24rem) too narrow for wide content
- **Fix**: Use `max-w-2xl` or `max-w-4xl` for wider modals, or `max-w-[90vw]` for viewport-relative

**Issue 3: No scroll when content exceeds modal**
- **Problem**: Content hidden when taller than modal
- **Fix**: Add `overflow-auto` to modal body, not the overlay

**Issue 4: Modal not centered**
- **Problem**: Modal appears at top-left instead of center
- **Fix**: Use flexbox centering: `fixed inset-0 flex items-center justify-center`

**Issue 5: Modal overlay not covering viewport**
- **Problem**: Background interaction possible through gaps
- **Fix**: Use `fixed inset-0` for overlay, `z-50` for proper stacking

### Tailwind Modal Patterns

**Basic Modal**:
```html
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
    <div class="p-6">
      <!-- Content -->
    </div>
  </div>
</div>
```

**Responsive Modal**:
```html
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
  <div class="bg-white rounded-lg shadow-xl w-full max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-auto">
    <div class="p-4 md:p-6 lg:p-8">
      <!-- Content -->
    </div>
  </div>
</div>
```

**Scrollable Modal with Header/Footer**:
```html
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
    <!-- Header (fixed) -->
    <div class="p-4 border-b flex items-center justify-between">
      <h2 class="text-xl font-bold">Title</h2>
      <button class="text-gray-500 hover:text-gray-700">✕</button>
    </div>

    <!-- Body (scrollable) -->
    <div class="p-6 overflow-auto flex-1">
      <!-- Content -->
    </div>

    <!-- Footer (fixed) -->
    <div class="p-4 border-t flex justify-end gap-2">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-primary">Save</button>
    </div>
  </div>
</div>
```

### Key Principles for Iterative Debugging

1. **Always verify with agent-browser eval**: Don't assume the fix worked - check computed styles
2. **ALWAYS use Tailwind classes in HTML**: Never use inline `style` attributes - put Tailwind utility classes directly in HTML elements
3. **MANDATORY: Check console after each reload**: After applying a fix and reloading, ALWAYS check the console to confirm the fix is working before proceeding to verification
4. **Check multiple properties**: Sometimes fixing one property affects others
5. **Monitor console errors**: New errors may appear after changes - check console after EVERY reload
6. **Compare parent and child**: Layout issues often involve parent containers
7. **Use specific selectors**: Be precise about which element you're checking
8. **Document each iteration**: Note what you tried and what the result was
9. **Know when to stop**: If 3+ iterations don't resolve it, reassess the approach
10. **Stop if console shows errors**: If console has errors after reload, STOP and fix them before continuing

### Verification Checklist

After each fix, verify these critical aspects:

```bash
agent-browser eval "(() => {
  const el = document.querySelector('.your-element');
  const styles = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  
  return {
    // Visibility
    isVisible: el.offsetWidth > 0 && el.offsetHeight > 0,
    display: styles.display,
    visibility: styles.visibility,
    opacity: styles.opacity,
    
    // Positioning
    position: styles.position,
    top: styles.top,
    left: styles.left,
    zIndex: styles.zIndex,
    
    // Dimensions
    width: styles.width,
    height: styles.height,
    boundingRect: rect,
    
    // Layout
    margin: styles.margin,
    padding: styles.padding,
    overflow: styles.overflow,
    
    // Interactivity
    pointerEvents: styles.pointerEvents,
    cursor: styles.cursor,
    
    // Parent context
    parentDisplay: el.parentElement ? getComputedStyle(el.parentElement).display : null,
    parentOverflow: el.parentElement ? getComputedStyle(el.parentElement).overflow : null
  };
})()"
```

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

## Production-Level Standards

All sub-skills ensure:

**Accessibility**:
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast verification
- Semantic HTML

**Performance**:
- No layout thrashing
- Optimized reflows
- Efficient selectors
- Lazy loading
- Performance budgets

**Cross-Browser**:
- Chrome, Firefox, Safari, Edge
- Mobile browsers
- Progressive enhancement
- Fallback strategies

**Code Quality**:
- Semantic HTML
- Maintainable CSS
- Reusable components
- Design tokens
- Documentation

**Responsive**:
- Mobile-first approach
- Fluid layouts
- Touch-friendly
- Device-agnostic
- Viewport optimization

## Integration with GSD Ecosystem

The DOM skills integrate with GSD (Guided Software Development):

**Design Phase**: Use `/dom-design` with `/gsd-plan-phase`
**Implementation Phase**: Use sub-skills with `/gsd-execute-phase`
**Testing Phase**: Verify with `/gsd-validate-phase`
**Production**: Deploy with `/gsd-ship`

## Example Usage

**Scenario**: "Create a responsive navigation with print optimization"

**Master skill routing**:
1. `/dom-design` - Design navigation layout
2. `/dom-mobile-desktop` - Make responsive
3. `/dom-print` - Optimize for print
4. `/dom-debug` - Debug any issues
5. `/dom-theme` - Apply theme colors

**Each sub-skill**:
- Follows professional workflow
- Performs self-checks
- Ensures production quality
- Documents decisions

## Output Format

Each sub-skill produces:

```markdown
# [Sub-Skill] Report

## Design Decisions
- [Decision 1 with rationale]
- [Decision 2 with rationale]

## Implementation
- [Code changes]
- [Files modified]

## Verification Results
- ✅ Accessibility: [details]
- ✅ Performance: [metrics]
- ✅ Cross-browser: [results]
- ✅ Responsive: [breakpoints]

## Self-Check
- ✅ Meets requirements
- ✅ Follows design principles
- ✅ Production-ready

## Documentation
- [Usage guide]
- [Maintenance notes]
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
- `invisible` → `visibility: hidden`
- `block` → `display: block`
- `inline` → `display: inline`

**Overflow**:
- `overflow-auto` → `overflow: auto`
- `overflow-hidden` → `overflow: hidden`
- `overflow-scroll` → `overflow: scroll`

**Positioning**:
- `relative` → `position: relative`
- `absolute` → `position: absolute`
- `fixed` → `position: fixed`
- `top-0 left-0` → `top: 0; left: 0`
- `z-10` → `z-index: 10`

### When Tailwind Doesn't Have a Utility

If you need a value not in Tailwind's defaults:

1. **Use arbitrary values** (Tailwind JIT):
   ```html
   <div class="top-[117px] bg-[#1da1f2]">
   ```

2. **Extend in tailwind.config.js**:
   ```js
   module.exports = {
     theme: {
       extend: {
         colors: {
           'brand-blue': '#1da1f2'
         }
       }
     }
   }
   ```

3. **Use @apply in CSS**:
   ```css
   .custom-component {
     @apply flex items-center p-4 bg-blue-500;
   }
   ```

**NEVER use inline styles** - these approaches keep your code maintainable.

## TSX Component Class Contract (cls Override, class Append)

When developing Woby components with TSX, follow this contract for the `cls` and `class` props:

| Prop | Purpose | Behavior |
|------|---------|----------|
| `cls` | Consumer's override classes | **Replaces** default styles when provided |
| `class` | Consumer's append classes | **Added to** default styles |

### Pattern for Component Development

```tsx
// Inside component implementation
const MyComponent = defaults(() => ({
    cls: $('') as ObservableMaybe<string>,   // Override
    class: $('') as ObservableMaybe<string>,  // Append
}), (props) => {
    const { cls, class: className, children } = props
    
    // CORRECT: cls overrides defaults, class appends
    return (
        <div class={[() => $$(cls) ?? 'default-base p-4', className]}>
            {children}
        </div>
    )
})
```

### Usage by Consumers

```tsx
// Override default styles completely
<MyComponent cls="custom-override bg-red-500">
// Result: "custom-override bg-red-500" (no defaults)

// Append to default styles
<MyComponent class="custom-addon shadow-lg">
// Result: "default-base p-4 custom-addon shadow-lg"

// Both together
<MyComponent cls="full-override" class="addon-class">
// Result: "full-override addon-class"
```

### Common Mistakes to Avoid

```tsx
// ❌ WRONG: Both append (cls doesn't override)
<div class={['default', cls, className]}>
// If cls="custom", result: "default custom className"

// ❌ WRONG: Non-reactive cls check
<div class={['default', cls]}>
// cls might be Observable, not string!

// ✅ CORRECT: Reactive with fallback
<div class={[() => $$(cls) ?? 'default', className]}>
```

### Why This Contract Matters

- **`cls`**: Consumer wants full control → replace default completely
- **`class`**: Consumer wants to extend → add without removing defaults
- Both props MUST be declared in `defaults()` for reactive HTML attribute support

## Concurrent Browser Agent Debugging/Verification

**CRITICAL**: For heavy sites or when you need to test multiple pages simultaneously, use **separate browser sessions** to spawn multiple independent browser windows.

### Architecture: Sessions = Windows (NOT Tabs)

Each `--session` flag creates a **separate browser window**, not a tab:

```
Agent 1 → Session "agent_1" → Browser Window 1 → yahoo.com
Agent 2 → Session "agent_2" → Browser Window 2 → microsoft.com
Agent 3 → Session "agent_3" → Browser Window 3 → oracle.com
Agent 4 → Session "agent_4" → Browser Window 4 → amazon.com
Agent 5 → Session "agent_5" → Browser Window 5 → apple.com
```

### Why Separate Sessions/Windows?

1. **True concurrency** - Each window runs independently
2. **No interference** - Heavy sites don't compete for resources in same window
3. **Better isolation** - Each agent has its own browser state
4. **Parallel execution** - All browsers load simultaneously

### Alternative: Multiple Tabs in One Window (NOT Recommended for Heavy Sites)

```bash
agent-browser open yahoo.com
agent-browser tab new microsoft.com
agent-browser tab new oracle.com
# All tabs in ONE browser window - resources shared
```

### Recommended: Multiple Sessions = Multiple Windows

```bash
# DEFAULT: Always use --headed to see browser windows
agent-browser --session agent_1 open --headed yahoo.com  # Window 1
agent-browser --session agent_2 open --headed microsoft.com  # Window 2
agent-browser --session agent_3 open --headed oracle.com  # Window 3
# Separate browser windows - true parallel execution
```

**Note**: `--headed` is the default. All browser windows will be visible. Use headless mode only when explicitly instructed.

### Use Cases

**When to use concurrent sessions:**
- Testing multiple heavy sites simultaneously (yahoo.com, microsoft.com, oracle.com)
- Comparing DOM behavior across different pages
- Performance testing with isolated browser instances
- Parallel debugging of multiple pages
- Load testing with separate browser contexts

**When to use tabs instead:**
- Light pages with minimal resources
- Sequential navigation within same site
- When you need shared browser state

### Session Naming Convention for TSX Component Testing

When testing multiple TSX components concurrently, use descriptive session names that identify the component and file:

**Format**: `component-file` where:
- `component` = Component name (e.g., `Button`, `Modal`, `Card`)
- `file` = TSX filename without extension (e.g., `app`, `index`, `components`)

**Examples**:
```bash
# Testing Button component in App.tsx
agent-browser --session Button-App open --headed http://localhost:3000

# Testing Modal component in index.tsx
agent-browser --session Modal-index open --headed http://localhost:3000

# Testing Card component in components.tsx
agent-browser --session Card-components open --headed http://localhost:3000
```

**Why this naming convention**:
- **Unique identification**: Each agent/session has a distinct name
- **Easy tracking**: Know which component is being tested in which file
- **Avoid conflicts**: No session name collisions when running multiple tests
- **Better debugging**: Clear which browser window is testing what

**Example: Parallel TSX Component Testing**:
```bash
# Spawn multiple agents to test different components concurrently
agent-browser --session Button-App open --headed http://localhost:3000 &
agent-browser --session Modal-Dialog open --headed http://localhost:3000 &
agent-browser --session Card-List open --headed http://localhost:3000 &

# Each agent tests its component in isolation
agent-browser --session Button-App eval "document.querySelector('button').click()"
agent-browser --session Modal-Dialog eval "document.querySelector('.modal').classList.contains('open')"
agent-browser --session Card-List eval "document.querySelectorAll('.card').length"

# Close all sessions
agent-browser --session Button-App close
agent-browser --session Modal-Dialog close
agent-browser --session Card-List close
```

**For CustomElement/Web Component Testing**:
```bash
# Testing my-counter component in counter.tsx
agent-browser --session my-counter-counter open --headed http://localhost:3000

# Testing user-profile component in profile.tsx
agent-browser --session user-profile-profile open --headed http://localhost:3000
```

### Example: Concurrent DOM Evaluation

```bash
# Spawn 5 browser windows simultaneously (DEFAULT: --headed to see all windows)
agent-browser --session agent_1 open --headed yahoo.com &
agent-browser --session agent_2 open --headed microsoft.com &
agent-browser --session agent_3 open --headed oracle.com &
agent-browser --session agent_4 open --headed amazon.com &
agent-browser --session agent_5 open --headed apple.com &

# Wait for all to load
sleep 5

# Evaluate DOM in each window concurrently
agent-browser --session agent_1 eval "document.querySelectorAll('*').length"
agent-browser --session agent_2 eval "document.querySelectorAll('*').length"
agent-browser --session agent_3 eval "document.querySelectorAll('*').length"
agent-browser --session agent_4 eval "document.querySelectorAll('*').length"
agent-browser --session agent_5 eval "document.querySelectorAll('*').length"

# Close all browsers
agent-browser --session agent_1 close
agent-browser --session agent_2 close
agent-browser --session agent_3 close
agent-browser --session agent_4 close
agent-browser --session agent_5 close
```

### Programmatic Concurrent Execution

For automated concurrent evaluation, use a script that spawns multiple sessions:

```javascript
// Node.js example: concurrent_browser_eval.js
const { exec } = require('child_process');
const sites = [
  'https://yahoo.com',
  'https://microsoft.com',
  'https://oracle.com',
];

// Run all evaluations in parallel (DEFAULT: --headed to see browser windows)
Promise.all(sites.map((url, i) => {
  const session = `agent_${i + 1}`;
  return new Promise((resolve) => {
    exec(`agent-browser --session ${session} open --headed "${url}"`, (err) => {
      if (!err) {
        // Wait for page load
        setTimeout(() => {
          exec(`agent-browser --session ${session} eval "document.title"`, (err, stdout) => {
            console.log(`[${session}] ${url}: ${stdout.trim()}`);
            exec(`agent-browser --session ${session} close`);
            resolve();
          });
        }, 3000);
      }
    });
  });
}));
```

**Key Points:**
- Each `--session` creates an isolated browser window
- Sessions run in parallel without interference
- Perfect for heavy sites that need dedicated resources
- Use `--headed` to see all browser windows simultaneously

## Getting Started

When you invoke this master skill, it will:
1. Analyze your request
2. Route to appropriate sub-skills
3. Execute professional workflow
4. Verify and self-check
5. Produce production-ready output

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
