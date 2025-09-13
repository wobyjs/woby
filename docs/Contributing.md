# Contributing

Thank you for your interest in contributing to Woby! This guide will help you get started with contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Guidelines](#contribution-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)

## Getting Started

### Ways to Contribute

- **Bug Reports**: Report issues you encounter
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Fix bugs or implement features
- **Documentation**: Improve or add documentation
- **Examples**: Create examples and tutorials
- **Community Support**: Help others in discussions

### Before You Start

1. Check existing [issues](https://github.com/wobyjs/woby/issues) and [discussions](https://github.com/wobyjs/woby/discussions)
2. For major changes, create an issue to discuss the approach first
3. Make sure your contribution aligns with the project's goals

## Development Setup

### Prerequisites

- Node.js 16 or higher
- pnpm (recommended) or npm
- Git

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/wobyjs/woby.git
cd woby

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test
```

### Project Structure

```
woby/
├── src/
│   ├── components/     # Built-in components
│   ├── hooks/         # Built-in hooks
│   ├── methods/       # Core methods
│   ├── jsx/           # JSX runtime
│   ├── types/         # TypeScript definitions
│   └── utils/         # Utility functions
├── dist/              # Built files
├── docs/              # Documentation
├── demo/              # Demo applications
└── package.json
```

### Development Commands

```bash
# Development build with watch
pnpm watch

# Build for production
pnpm build

# Run specific demo
pnpm dev:counter
pnpm dev:clock

# Clean build artifacts
pnpm clean

# Type checking
pnpm compile
```

## Contribution Guidelines

### Reporting Issues

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details** (OS, Node version, browser)
5. **Minimal reproduction** example if possible

Example:
```markdown
## Bug Description
Component doesn't re-render when observable changes

## Steps to Reproduce
1. Create observable with `$(0)`
2. Update value in event handler
3. Component doesn't update

## Expected Behavior
Component should re-render with new value

## Actual Behavior
Component shows old value

## Environment
- OS: macOS 13.0
- Node: 18.17.0
- Browser: Chrome 115.0
```

### Feature Requests

For feature requests, please provide:

1. **Use case description**
2. **Proposed API** (if applicable)
3. **Examples** of how it would be used
4. **Alternatives considered**

### Pull Requests

1. **Fork** the repository
2. **Create a branch** for your changes
3. **Make your changes** following the code style
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Ensure all tests pass**
7. **Submit a pull request**

#### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Added tests for new functionality
- [ ] All existing tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Code Style

### TypeScript Guidelines

1. **Use TypeScript** for all new code
2. **Provide proper types** for all functions and variables
3. **Export types** when they might be useful to users
4. **Use generic types** appropriately

```typescript
// Good
function createObservable<T>(value: T): Observable<T> {
  return $(value)
}

// Avoid
function createObservable(value: any): any {
  return $(value)
}
```

### Naming Conventions

- **Functions**: camelCase (`createObservable`)
- **Components**: PascalCase (`ErrorBoundary`)
- **Variables**: camelCase (`userCount`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_OPTIONS`)
- **Types**: PascalCase (`ObservableOptions`)

### Function Design

1. **Keep functions small** and focused
2. **Use pure functions** when possible
3. **Handle edge cases** appropriately
4. **Provide good error messages**

```typescript
// Good
function validateEmail(email: string): boolean {
  if (typeof email !== 'string') {
    throw new Error('Email must be a string')
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Avoid
function validateEmail(email: any) {
  return email.includes('@')
}
```

### Component Guidelines

1. **Use observables** for component state
2. **Keep components focused** on a single responsibility
3. **Extract reusable logic** into custom hooks
4. **Handle loading and error states**

```typescript
// Good
const UserProfile = ({ userId }: { userId: number }) => {
  const user = useResource(() => fetchUser(userId))
  
  return (
    <Switch>
      <Match when={() => user.loading()}>
        <div>Loading...</div>
      </Match>
      <Match when={() => user.error()}>
        <div>Error: {user.error()?.message}</div>
      </Match>
      <Match when={() => user()}>
        <div>Hello, {user()?.name}!</div>
      </Match>
    </Switch>
  )
}
```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test src/hooks/use-memo.test.ts
```

### Writing Tests

1. **Test public APIs** and behavior
2. **Use descriptive test names**
3. **Test edge cases** and error conditions
4. **Keep tests focused** and independent

```typescript
import { $ } from '../src'

describe('Observable', () => {
  it('should create observable with initial value', () => {
    const obs = $(42)
    expect(obs()).toBe(42)
  })
  
  it('should update value when setter is called', () => {
    const obs = $(0)
    obs(5)
    expect(obs()).toBe(5)
  })
  
  it('should support function updates', () => {
    const obs = $(10)
    obs(prev => prev * 2)
    expect(obs()).toBe(20)
  })
})
```

### Test Categories

- **Unit tests**: Individual functions and components
- **Integration tests**: Component interactions
- **E2E tests**: Full application workflows (for demos)

## Documentation

### Documentation Guidelines

1. **Keep it up to date** with code changes
2. **Use clear, simple language**
3. **Provide practical examples**
4. **Include TypeScript types**
5. **Cross-reference related topics**

### Writing Style

- Use **active voice** where possible
- **Explain the "why"** not just the "how"
- **Start with simple examples** then show advanced usage
- **Include common pitfalls** and solutions

### Documentation Structure

```markdown
# Component/Function Name

Brief description of what it does.

## Signature

```typescript
function example<T>(param: T): ReturnType
```

## Parameters

- `param`: Description of parameter

## Returns

Description of return value

## Usage

### Basic Example

```typescript
// Simple example
```

### Advanced Example

```typescript
// More complex example
```

## See Also

- [Related Topic](./related.md)
```

### Code Examples

- **Always include imports**
- **Show complete, runnable examples**
- **Use realistic variable names**
- **Demonstrate common patterns**

## Release Process

### Versioning

Woby follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Changelog

All notable changes are documented in the changelog:

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

## Community

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

### Getting Help

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Discord**: Real-time community chat (if available)

### Recognition

Contributors are recognized in:
- **Release notes** for significant contributions
- **README** contributors section
- **Documentation** author credits

## Questions?

If you have questions about contributing, feel free to:

1. Check this guide and existing documentation
2. Search existing issues and discussions
3. Create a new discussion with your question
4. Reach out to maintainers

Thank you for contributing to Woby! 🎉