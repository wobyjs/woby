# Woby Documentation Home

Welcome to the Woby documentation wiki! This guide covers everything you need to know about the Woby framework - a high-performance framework with fine-grained observable-based reactivity for building rich applications.

## 📚 Documentation Sections

### Getting Started
- **[Installation Guide](./Installation.md)** - Setup and installation instructions
- **[Quick Start Tutorial](./Quick-Start.md)** - Build your first Woby application
- **[Examples Gallery](./Examples.md)** - Practical examples and demos

### Core Concepts
- **[Reactivity System](./Reactivity-System.md)** - Understanding observables and reactivity
- **[Core Methods](./Core-Methods.md)** - Essential framework functions ($, batch, render, etc.)
- **[Hooks](./Hooks.md)** - Built-in hooks and utilities (useEffect, useMemo, etc.)
- **[Built-in Components](./Built-in-Components.md)** - Framework components (For, If, Switch, etc.)
- **[Class Management](./Class-Management.md)** - Advanced class handling with reactive support
- **[Context](./Context.md)** - Context API for sharing data between components

### Advanced Topics
- **[Best Practices](./Best-Practices.md)** - Recommended patterns and practices
- **[Custom Elements](./CUSTOM_ELEMENTS.md)** - Creating web components with Woby
- **[Custom Element Best Practices](./Custom-Element-Best-Practices.md)** - Best practices for custom elements
- **[Component Defaults](./CUSTOM_ELEMENTS.md#component-defaults-and-two-way-synchronization)** - Two-way synchronization for custom elements
- **[Woby vs React](./Woby-vs-React.md)** - API differences and migration guide
- **[FAQ](./FAQ.md)** - Frequently asked questions

### Community & Contributing
- **[Contributing Guide](./Contributing.md)** - How to contribute to Woby

## 🚀 Quick Links

| Topic | Link |
|-------|------|
| **API Reference** | [Core Methods](./Core-Methods.md) • [Hooks](./Hooks.md) |
| **Components** | [Built-in Components](./Built-in-Components.md) |
| **Examples** | [Examples Gallery](./Examples.md) |
| **Class Management** | [Class Management](./Class-Management.md) |
| **Context API** | [Context](./Context.md) |
| **Custom Elements** | [Custom Elements](./CUSTOM_ELEMENTS.md) • [Custom Element Best Practices](./Custom-Element-Best-Practices.md) • [Component Defaults](./CUSTOM_ELEMENTS.md#component-defaults-and-two-way-synchronization) |
| **Demos** | [Counter Demo](./demos/Counter-Demo.md) • [Nested Properties Demo](./demos/Nested-Properties-Demo.md) • [Custom Element Practical Guide](./demos/Custom-Element-Practical-Guide.md) |
| **Help** | [FAQ](./FAQ.md) • [Contributing](./Contributing.md) |

## 🎯 Key Features

Woby is built upon the [Woby](https://github.com/wobyjs/woby) reactive core, providing an enhanced API for component-based development:

- **No VDOM**: Direct DOM manipulation for maximum performance
- **Fine-grained reactivity**: Automatic dependency tracking with observables
- **No stale closures**: Functions always execute afresh
- **No rules of hooks**: Hooks can be used anywhere with full flexibility
- **No dependencies arrays**: Automatic dependency detection
- **No props diffing**: Direct property updates
- **No key prop**: Built-in list handling with `For` component
- **No Babel**: Works with plain JavaScript and JSX
- **Built-in Class Management**: Advanced class handling similar to `classnames`/`clsx`
- **Custom Elements**: Create standard web components with full two-way synchronization

## 📖 Learning Path

### 1. **Beginners Start Here**
- [Installation Guide](./Installation.md)
- [Quick Start Tutorial](./Quick-Start.md)
- [Reactivity System](./Reactivity-System.md)

### 2. **Core Concepts**
- [Core Methods](./Core-Methods.md)
- [Hooks](./Hooks.md)
- [Built-in Components](./Built-in-Components.md)

### 3. **Advanced Features**
- [Class Management](./Class-Management.md)
- [Custom Elements](./CUSTOM_ELEMENTS.md)
- [Component Defaults](./CUSTOM_ELEMENTS.md#component-defaults-and-two-way-synchronization)
- [Examples Gallery](./Examples.md)
- [Best Practices](./Best-Practices.md)

### 4. **Specialized Topics**
- [Custom Element Best Practices](./Custom-Element-Best-Practices.md)
- [Custom Element Practical Guide](./demos/Custom-Element-Practical-Guide.md)
- [Woby vs React](./Woby-vs-React.md)
- [FAQ](./FAQ.md)

## 🛠️ External Resources

- **[GitHub Repository](https://github.com/wobyjs/woby)** - Source code and issues
- **[Demo Applications](https://github.com/wobyjs/demo)** - Live examples
- **[CodeSandbox Playground](https://codesandbox.io/s/playground-7w2pxg)** - Interactive environment

## 🤝 Community Support

- **[Discord Chat](https://discord.gg/E6pK7VpnjC)** - Real-time community support
- **[GitHub Issues](https://github.com/wobyjs/woby/issues)** - Bug reports and feature requests
- **[Twitter](https://twitter.com/wobyjs)** - Latest updates and announcements

## 📝 Contributing

Woby is an open-source project and contributions are welcome! See the [Contributing Guide](./Contributing.md) for details on how to get involved.

---

*This documentation is a living document and is regularly updated. For the most current information, always refer to the latest version in the repository.*