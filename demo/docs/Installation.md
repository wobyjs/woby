# Installation & Setup

This guide will help you set up the Woby Demo repository and run the demo applications locally.

## Prerequisites

- **Node.js** 16 or higher
- **pnpm** (recommended) or npm
- **Git** for cloning the repository

## Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/wobyjs/demo.git
cd demo
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

This will install dependencies for the root project and all demo applications using workspaces.

### 3. Verify Installation

```bash
# List available demo scripts
pnpm run

# Run the default demo (playground)
pnpm dev
```

## Project Structure

```
@woby/demo/
├── demo/                    # All demo applications
│   ├── benchmark/          # Performance benchmarking
│   ├── boxes/             # Animated boxes demo
│   ├── clock/             # Real-time clock
│   ├── counter/           # Basic counter
│   ├── emoji_counter/     # Emoji-based counter
│   ├── html/              # HTML template literals
│   ├── hyperscript/       # HyperScript API usage
│   ├── playground/        # Interactive testing environment
│   ├── spiral/            # Animated spiral
│   ├── standalone/        # Single-file demo
│   ├── store_counter/     # Store-based state management
│   ├── triangle/          # Sierpinski triangle
│   └── uibench/           # UI performance benchmark
├── resources/             # Shared assets and images
├── package.json           # Root package configuration
├── pnpm-workspace.yaml    # Workspace configuration
└── tsconfig.json          # TypeScript configuration
```

## Running Individual Demos

Each demo can be run independently using the following commands:

### Development Mode

```bash
# Counter demo
pnpm dev:counter

# Clock demo
pnpm dev:clock

# Playground (comprehensive demo)
pnpm dev:playground

# Benchmark suite
pnpm dev:benchmark

# Animated boxes
pnpm dev:boxes

# And more... (see package.json for full list)
```

### Production Builds

```bash
# Build and serve counter demo in production mode
pnpm prod:counter

# Build and serve playground in production mode
pnpm prod:playground
```

## Demo-Specific Setup

### Basic Demos (Counter, Clock, etc.)
No additional setup required. Just run the demo command.

### Benchmark Demo
Includes performance comparison tools:
```bash
pnpm dev:benchmark
# Open http://localhost:5173 to view benchmark results
```

### Playground Demo
Comprehensive testing environment with all Woby features:
```bash
pnpm dev:playground
# Open http://localhost:5173 for interactive playground
```

### Standalone Demo
Single HTML file demo:
```bash
# Navigate to demo folder and open in browser
cd demo/standalone
open index.html
```

## Development Workflow

### Workspace Structure
The repository uses pnpm workspaces for efficient dependency management:

```yaml
# pnpm-workspace.yaml
packages:
  - "demo/*"
```

### Adding Dependencies
To add dependencies to a specific demo:

```bash
# Add to specific demo
pnpm --filter=./demo/counter add some-package

# Add to root (affects all demos)
pnpm add some-package
```

### TypeScript Configuration
All demos share the root TypeScript configuration with demo-specific overrides:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "jsxImportSource": "woby"
  }
}
```

## Build Tools

### Vite Configuration
Most demos use Vite for development and building:

```typescript
// vite.config.mts (typical demo configuration)
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'woby'
  }
})
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Run default demo (playground) |
| `pnpm dev:*` | Run specific demo in development mode |
| `pnpm prod:*` | Build and serve demo in production mode |
| `pnpm clean` | Clean build artifacts |

## Troubleshooting

### Common Issues

**Demo not starting:**
```bash
# Clear node modules and reinstall
rm -rf node_modules demo/*/node_modules
pnpm install
```

**TypeScript errors:**
```bash
# Rebuild TypeScript
pnpm clean
pnpm install
```

**Port conflicts:**
Each demo typically runs on port 5173. If you need to run multiple demos:
```bash
# Specify different port
pnpm dev:counter -- --port 5174
```

### Performance Issues

For better development performance:
1. Use pnpm instead of npm
2. Close unused demo servers
3. Clear browser cache between demos

### Browser Compatibility

Demos are tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Next Steps

Once you have the demos running:

1. **Explore Basic Demos**: Start with [Counter](./demos/Counter.md) and [Clock](./demos/Clock.md)
2. **Try Interactive Demos**: Check out the [Playground](./demos/Playground.md)
3. **Run Performance Tests**: Explore [Benchmark](./demos/Benchmark.md) and [Triangle](./demos/Triangle.md)
4. **Learn Patterns**: Review [Code Patterns](./Code-Patterns.md) used across demos

For detailed information about running specific demos, see [Running Demos](./Running-Demos.md).