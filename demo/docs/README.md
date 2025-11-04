# Woby Framework Documentation

Welcome to the Woby Framework documentation. This documentation covers the core concepts, API reference, and usage examples for the Woby framework.

## Table of Contents

- [Installation](Installation.md)
- [Basic Demos](Basic-Demos.md)
- [Contributing](Contributing.md)

## Core Concepts

### What is Woby?

Woby is a modern, reactive JavaScript framework that provides a lightweight alternative to React with a focus on performance and simplicity. It uses observables for state management and provides a familiar JSX syntax for component creation.

### Key Features

1. **Reactive Observables**: State management using observables for automatic UI updates
2. **Component-Based Architecture**: Build encapsulated components that manage their own state
3. **JSX Syntax**: Familiar syntax for component creation
4. **Custom Elements**: Native web component support with automatic attribute handling
5. **Lightweight**: Minimal overhead and fast rendering
6. **TypeScript Support**: First-class TypeScript support with comprehensive type definitions

## API Reference

### Core Methods

- `createElement`: Create DOM elements
- `render`: Render components to the DOM
- `customElement`: Create custom HTML elements
- `$`: Create observables
- `$$`: Extract values from observables

### Hooks

- `useEffect`: Handle side effects
- `useMemo`: Memoize computed values
- `useContext`: Access context values (both JSX/TSX and custom elements)
- `useMounted`: Track component mount state

### Context API

Woby provides a context hook for sharing data between components:

1. **useContext**: Standard context hook for both JSX/TSX components and custom elements
   - Works in both JSX/TSX components and HTML custom elements
   - Requires explicit Provider components
   - Follows React-like context patterns with enhanced custom element support

## Demos

Explore the various demos to see Woby in action:

- [Counter](demos/Counter.md): Basic counter component demonstrating custom elements, reactive properties, and context usage
- More demos coming soon...

## Getting Started

To get started with Woby:

1. Install the framework
2. Create your first component
3. Use the provided hooks and methods to build reactive UIs
4. Leverage custom elements for native web component functionality

## Contributing

See our [Contributing Guide](Contributing.md) for information on how to contribute to the Woby framework.

# Woby Demo Documentation

This directory contains comprehensive documentation for the Woby Demo repository, including guides for all demo applications, development patterns, and contribution guidelines.

## 📚 Documentation Structure

### Main Pages
- **[Home](./Home.md)** - Main documentation landing page
- **[Installation](./Installation.md)** - Setup and installation guide
- **[Basic Demos](./Basic-Demos.md)** - Simple learning examples
- **[Contributing](./Contributing.md)** - How to contribute new demos

### Demo Categories
- **Basic Demos** - Counter, Clock, Store Counter, Emoji Counter
- **Interactive Demos** - Playground, user interaction examples
- **Performance Demos** - Benchmark, Triangle, Boxes, UIBench
- **API Demos** - HTML, HyperScript, different API approaches

### Individual Demo Documentation
The `demos/` folder contains detailed documentation for each demo application:

| Demo | Purpose | Concepts |
|------|---------|----------|
| [Counter](./demos/Counter.md) | Basic reactivity | Observables, events, custom elements |
| Clock | Time-based updates | Animation loops, SVG, calculations |
| Playground | Comprehensive testing | All features, interactive exploration |
| Benchmark | Performance testing | Framework comparison, optimization |
| Boxes | Animation performance | Smooth animations, many elements |
| Triangle | Recursive rendering | Performance with complex structures |

## 🚀 Quick Navigation

### For Beginners
1. Start with [Installation](./Installation.md)
2. Read [Basic Demos](./Basic-Demos.md) overview
3. Study [Counter Demo](./demos/Counter.md) in detail
4. Try running demos locally

### For Contributors
1. Review [Contributing Guidelines](./Contributing.md)
2. Study existing demo patterns
3. Follow demo creation guide
4. Submit pull requests

### For Advanced Users
1. Explore performance demos
2. Study optimization techniques
3. Create custom demos
4. Contribute improvements

## 📁 File Organization

```
docs/
├── Home.md                    # Main landing page
├── Installation.md            # Setup guide
├── Basic-Demos.md            # Overview of learning demos
├── Contributing.md           # Contribution guidelines
├── README.md                 # This file
└── demos/                    # Individual demo docs
    ├── Counter.md            # Counter demo details
    ├── Clock.md              # Clock demo details
    ├── Playground.md         # Playground demo details
    └── ...                   # More demo documentation
```

## 🎯 Documentation Goals

### Educational Focus
- **Clear explanations** of concepts demonstrated
- **Step-by-step learning** from basic to advanced
- **Practical examples** with real code
- **Learning objectives** for each demo

### Developer Support
- **Setup instructions** for running demos
- **Code patterns** and best practices
- **Performance insights** and optimizations
- **Contribution guidance** for community

### Reference Material
- **Complete API coverage** in demo contexts
- **Cross-references** between related concepts
- **Troubleshooting guides** for common issues
- **Extension examples** for customization

## 📝 Documentation Standards

### Content Guidelines
- **Example-driven** - Show don't just tell
- **Beginner-friendly** - Assume minimal prior knowledge
- **Progressive complexity** - Build understanding step by step
- **Practical focus** - Emphasize real-world usage

### Code Examples
- **Complete and runnable** - All examples should work
- **Well-commented** - Explain non-obvious concepts
- **TypeScript** - Include proper type information
- **Best practices** - Demonstrate good patterns

### Structure
- **Clear headings** - Easy navigation and scanning
- **Consistent format** - Standard sections across demos
- **Cross-linking** - Connect related concepts
- **Visual aids** - Screenshots and diagrams when helpful

## 🔄 Keeping Documentation Updated

### Regular Updates
- **Code sync** - Keep docs aligned with demo code
- **New demos** - Document all new demo applications
- **Pattern evolution** - Update as best practices evolve
- **Community feedback** - Incorporate user suggestions

### Version Management
- **Change tracking** - Document significant changes
- **Compatibility notes** - Note version requirements
- **Migration guides** - Help with major updates
- **Deprecation notices** - Clear upgrade paths

## 🤝 Contributing to Documentation

### How to Help
- **Improve clarity** - Make explanations clearer
- **Add examples** - Provide more code samples
- **Fix errors** - Correct mistakes and typos
- **Expand coverage** - Document missing concepts

### Documentation Process
1. **Identify gaps** - Find areas needing improvement
2. **Research thoroughly** - Understand concepts deeply
3. **Write clearly** - Use simple, direct language
4. **Test examples** - Ensure all code works
5. **Get feedback** - Review with community

### Standards to Follow
- **Consistent style** - Follow existing patterns
- **Clear structure** - Use standard section formats
- **Accurate content** - Verify all technical details
- **Good examples** - Provide practical, working code

## 🔗 External Resources

- **[Woby Framework](https://github.com/wobyjs/woby)** - Main framework repository
- **[Live Demos](https://codesandbox.io/@woby)** - CodeSandbox collection
- **[Framework Docs](../woby/docs/)** - Core framework documentation
- **[Community Discussions](https://github.com/wobyjs/woby/discussions)** - Ask questions and share ideas

## 📊 Documentation Metrics

### Coverage Goals
- **100% demo coverage** - Every demo documented
- **All concepts explained** - No undocumented features
- **Complete examples** - Working code for all concepts
- **Regular updates** - Keep pace with development

### Quality Measures
- **User feedback** - Community satisfaction with docs
- **Ease of learning** - Success rate of new users
- **Contribution rate** - Community engagement
- **Issue resolution** - Quick problem solving

---

*This documentation is maintained by the Woby community. For questions or improvements, please see our [Contributing Guide](./Contributing.md) or open an issue in the main repository.*