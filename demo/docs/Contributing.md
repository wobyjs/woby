# Contributing to Woby Demo

Thank you for your interest in contributing to the Woby Demo repository! This guide will help you understand how to contribute new demos, improve existing ones, and enhance the documentation.

## Table of Contents

- [Types of Contributions](#types-of-contributions)
- [Setting Up Development](#setting-up-development)
- [Creating New Demos](#creating-new-demos)
- [Demo Guidelines](#demo-guidelines)
- [Documentation](#documentation)
- [Submission Process](#submission-process)

## Types of Contributions

### New Demo Applications
- **Learning demos** - Simple examples for educational purposes
- **Feature demos** - Showcasing specific Woby features
- **Performance demos** - Benchmarking and optimization examples
- **Real-world examples** - Practical application patterns

### Improving Existing Demos
- **Bug fixes** - Resolving issues in demo code
- **Performance improvements** - Optimizing demo performance
- **Code clarity** - Making demos easier to understand
- **Visual enhancements** - Improving demo presentation

### Documentation
- **Demo documentation** - Detailed explanations of demo concepts
- **Code comments** - Inline documentation in demo source
- **Learning guides** - Educational content around demos
- **API examples** - Usage examples for Woby features

## Setting Up Development

### Prerequisites
- Node.js 16+
- pnpm (recommended)
- Basic understanding of Woby framework

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/wobyjs/demo.git
cd demo

# Install dependencies
pnpm install

# Test that demos work
pnpm dev:counter
```

### Development Workflow
```bash
# Create a new branch for your contribution
git checkout -b feature/my-new-demo

# Make your changes
# ... development work ...

# Test your changes
pnpm dev:my-demo

# Commit and push
git add .
git commit -m "Add new demo: My Demo"
git push origin feature/my-new-demo
```

## Creating New Demos

### Demo Structure
Each demo should follow this structure:

```
demo/my-demo/
├── index.tsx          # Main demo source
├── index.html         # HTML entry point
├── package.json       # Demo-specific dependencies
├── vite.config.mts    # Vite configuration
└── README.md          # Demo-specific documentation
```

### Step-by-Step Process

#### 1. Create Demo Directory
```bash
mkdir demo/my-demo
cd demo/my-demo
```

#### 2. Create package.json
```json
{
  "name": "@woby/demo-my-demo",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "prod": "vite build && vite preview"
  },
  "dependencies": {
    "woby": "workspace:*"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

#### 3. Create vite.config.mts
```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'woby'
  }
})
```

#### 4. Create index.html
```html
<!DOCTYPE html>
<html>
<head>
  <title>My Demo - Woby</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./index.tsx"></script>
</body>
</html>
```

#### 5. Create index.tsx
```typescript
import { $, render } from 'woby'

const MyDemo = () => {
  const message = $('Hello, Woby!')
  
  return (
    <div>
      <h1>My Demo</h1>
      <p>{message}</p>
      <button onClick={() => message('Updated!')}>
        Update Message
      </button>
    </div>
  )
}

render(<MyDemo />, document.getElementById('app'))
```

#### 6. Add Scripts to Root package.json
Add these scripts to the root `package.json`:

```json
{
  "scripts": {
    "dev:my-demo": "pnpm --filter=./demo/my-demo run dev",
    "prod:my-demo": "pnpm --filter=./demo/my-demo run prod"
  }
}
```

#### 7. Test Your Demo
```bash
# From root directory
pnpm dev:my-demo
```

## Demo Guidelines

### Code Quality
- **Clean code** - Well-structured, readable code
- **Comments** - Explain complex concepts
- **TypeScript** - Use proper typing
- **Error handling** - Handle edge cases gracefully

### Educational Value
- **Clear purpose** - Each demo should teach specific concepts
- **Progressive complexity** - Build from simple to complex
- **Best practices** - Demonstrate good Woby patterns
- **Real-world relevance** - Show practical applications

### Performance
- **Efficient updates** - Leverage Woby's fine-grained reactivity
- **Minimal renders** - Avoid unnecessary re-renders
- **Memory management** - Clean up resources properly
- **Bundle size** - Keep dependencies minimal

### User Experience
- **Visual appeal** - Demos should look professional
- **Responsive design** - Work on different screen sizes
- **Accessibility** - Follow accessibility best practices
- **Browser compatibility** - Work in modern browsers

### Code Style

#### Naming Conventions
```typescript
// Components: PascalCase
const MyComponent = () => { }

// Variables: camelCase
const userName = $('John')

// Constants: UPPER_SNAKE_CASE
const MAX_ITEMS = 100

// Files: kebab-case
// my-demo.tsx, user-profile.tsx
```

#### Component Structure
```typescript
// 1. Imports
import { $, render } from 'woby'

// 2. Types (if needed)
interface User {
  name: string
  age: number
}

// 3. Helper functions
const formatName = (name: string) => name.toUpperCase()

// 4. Components
const UserProfile = ({ user }: { user: User }) => {
  return <div>{formatName(user.name)}</div>
}

// 5. Main component
const App = () => {
  const user = $({ name: 'John', age: 30 })
  return <UserProfile user={user()} />
}

// 6. Render
render(<App />, document.getElementById('app'))
```

#### Observable Patterns
```typescript
// Good: Descriptive names
const userCount = $(0)
const isLoading = $(false)
const selectedItems = $([])

// Good: Function updates
count(prev => prev + 1)

// Good: Batch related updates
batch(() => {
  setLoading(false)
  setData(response)
  setError(null)
})
```

## Documentation

### Demo Documentation
Each demo should include:

1. **Purpose** - What the demo teaches
2. **Features** - What Woby features are demonstrated
3. **Code explanation** - Key concepts explained
4. **Learning points** - What users should take away
5. **Next steps** - Related demos or concepts

### README Template
```markdown
# My Demo

## Overview
Brief description of what this demo demonstrates.

## Features Demonstrated
- Feature 1
- Feature 2
- Feature 3

## Key Concepts
Explanation of the main concepts shown in this demo.

## Running the Demo
```bash
pnpm dev:my-demo
```

## Learning Points
1. Point 1
2. Point 2
3. Point 3

## Next Steps
- Related demo 1
- Related demo 2
```

### Code Comments
```typescript
// Use comments to explain non-obvious concepts
const Clock = () => {
  // Convert milliseconds since midnight to seconds for easier calculations
  const time = $(getMillisecondsSinceMidnight() / 1000)
  
  // Update time every animation frame for smooth movement
  useAnimationLoop(() => {
    time(getMillisecondsSinceMidnight() / 1000)
  })
  
  // Calculate rotation angles for clock hands
  const hourAngle = () => (time() / 60 / 60 % 12) / 12 * 360
  
  return <div>...</div>
}
```

## Submission Process

### Before Submitting
1. **Test thoroughly** - Ensure demo works correctly
2. **Check performance** - Verify no memory leaks or performance issues
3. **Review documentation** - Ensure demo is well-documented
4. **Follow guidelines** - Adhere to coding standards
5. **Update root scripts** - Add dev/prod scripts to root package.json

### Pull Request Process
1. **Create descriptive PR title** - "Add interactive todo list demo"
2. **Provide detailed description** - Explain what the demo shows
3. **Include screenshots** - Visual representation of the demo
4. **Link related issues** - If addressing specific requests
5. **Request review** - Ask maintainers for feedback

### PR Template
```markdown
## Demo Description
Brief description of the new demo.

## Features Demonstrated
- List of Woby features shown
- Educational concepts covered

## Screenshots
![Demo Screenshot](screenshot.png)

## Testing
- [ ] Demo runs correctly (`pnpm dev:demo-name`)
- [ ] No console errors
- [ ] Works in multiple browsers
- [ ] Documentation is complete

## Related Issues
Closes #123
```

### Review Process
1. **Code review** - Maintainers review code quality and style
2. **Demo testing** - Verify demo works as intended
3. **Documentation review** - Check educational value and clarity
4. **Integration testing** - Ensure demo fits well with existing demos

## Quality Checklist

Before submitting, ensure your demo meets these criteria:

### Functionality
- [ ] Demo runs without errors
- [ ] All features work as intended
- [ ] Responsive design works
- [ ] Cross-browser compatible

### Code Quality
- [ ] TypeScript types are correct
- [ ] Code follows style guidelines
- [ ] No unused imports or variables
- [ ] Proper error handling

### Educational Value
- [ ] Clear learning objectives
- [ ] Progressive complexity
- [ ] Good code comments
- [ ] Practical examples

### Documentation
- [ ] README.md is complete
- [ ] Code is well-commented
- [ ] Learning points are clear
- [ ] Next steps provided

### Performance
- [ ] No memory leaks
- [ ] Efficient rendering
- [ ] Minimal bundle size
- [ ] Good user experience

## Getting Help

If you need help with your contribution:

1. **Check existing demos** - See how similar demos are implemented
2. **Read Woby documentation** - Understand framework concepts
3. **Ask questions** - Open an issue for clarification
4. **Join discussions** - Participate in community discussions

## Recognition

Contributors are recognized in:
- **Demo credits** - Attribution in demo documentation
- **Contributor list** - Listed in repository contributors
- **Release notes** - Mentioned in version releases

Thank you for contributing to Woby Demo! Your contributions help others learn and understand the Woby framework.