# Installation

This guide will assist you in installing and configuring Woby for your project.

## Prerequisites

- Node.js 16+ 
- npm, yarn, or pnpm package manager

## Quick Installation

### Using npm
```bash
npm install woby
```

### Using yarn
```bash
yarn add woby
```

### Using pnpm
```bash
pnpm add woby
```

## Project Setup

### 1. Basic HTML Setup
Create an `index.html` file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Woby Application</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="./src/main.tsx"></script>
</body>
</html>
```

### 2. TypeScript Configuration
Create a `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "jsx": "react-jsx",
    "jsxImportSource": "woby"
  },
  "include": ["src"]
}
```

### 3. JSX Setup
For JSX support, configure your bundler to utilize Woby's JSX runtime:

#### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'woby'
  }
})
```

#### Webpack Configuration
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              jsx: 'react-jsx',
              jsxImportSource: 'woby'
            }
          }
        }
      }
    ]
  }
}
```

## Starter Templates

### Minimal Example
```typescript
// src/main.tsx
import { $, render } from 'woby'

const Counter = () => {
  const count = $(0)
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => count(c => c + 1)}>
        Increment
      </button>
    </div>
  )
}

render(<Counter />, document.getElementById('app')!)
```

## Verification

To verify your installation is functioning correctly:

1. Create the files above
2. Run your development server (e.g., `vite dev`)
3. Open your browser to observe the counter application

## Next Steps

- [Quick Start Guide](./Quick-Start.md) - Build your first real application
- [Core Concepts](./Reactivity-System.md) - Learn about observables
- [Examples](./Examples.md) - See more complex examples

## Common Issues

### TypeScript Errors
Ensure your `tsconfig.json` includes the correct JSX configuration and that `woby` types are properly resolved.

### Build Errors
Verify your bundler is configured to handle JSX with Woby's runtime. Refer to the bundler-specific configurations above.

For additional troubleshooting assistance, consult our [Troubleshooting Guide](./Troubleshooting.md).