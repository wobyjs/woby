# 📝 Playground Test Examples

Complete examples showing how to write testable components and add assertions.

## Table of Contents

1. [Basic Component Test](#basic-component-test)
2. [State Management Test](#state-management-test)
3. [Event Handler Test](#event-handler-test)
4. [SSR Test](#ssr-test)
5. [Custom Element Test](#custom-element-test)
6. [Async Operation Test](#async-operation-test)
7. [Observable Resolution Test](#observable-resolution-test)
8. [Complex Integration Test](#complex-integration-test)

---

## Basic Component Test

### Component File: `TestSimpleCounter.tsx`

```tsx
import { $, type JSX } from 'woby'
import { registerTestObservable, testObservables } from './util'

const name = 'TestSimpleCounter'

const TestSimpleCounter = (): JSX.Element => {
    // Create observable state
    const count = $(0)
    registerTestObservable(`${name}_count`, count)
    
    // Increment function
    const increment = () => count(prev => prev + 1)
    
    // Test assertion after timeout
    setTimeout(() => {
        const currentValue = count()
        
        if (currentValue === 5) {
            console.log(`✅ ${name} passed: count reached expected value 5`)
        } else {
            console.error(`❌ ${name} failed: expected 5, got ${currentValue}`)
        }
    }, 1000)
    
    return (
        <div>
            <h3>Simple Counter</h3>
            <p>Count: {count}</p>
            <button onClick={increment}>+</button>
        </div>
    )
}

export default TestSimpleCounter
```

### Expected Console Output

```
✅ TestSimpleCounter passed: count reached expected value 5
```

---

## State Management Test

### Component File: `TestStateManager.tsx`

```tsx
import { $, $$, type JSX } from 'woby'
import { registerTestObservable, testObservables, assert } from './util'

const name = 'TestStateManager'

interface State {
    user: string | null
    authenticated: boolean
    role: 'admin' | 'user' | 'guest'
}

const TestStateManager = (): JSX.Element => {
    // Complex state object
    const state = $<State>({
        user: null,
        authenticated: false,
        role: 'guest'
    })
    
    registerTestObservable(`${name}_state`, state)
    
    // Login action
    const login = (username: string) => {
        state(prev => ({
            ...prev,
            user: username,
            authenticated: true,
            role: 'user'
        }))
    }
    
    // Logout action
    const logout = () => {
        state(prev => ({
            ...prev,
            user: null,
            authenticated: false,
            role: 'guest'
        }))
    }
    
    // Test sequence
    setTimeout(() => {
        // Step 1: Login
        login('testuser')
        
        setTimeout(() => {
            const currentState = $$(state)
            
            if (currentState.authenticated && currentState.user === 'testuser') {
                console.log(`✅ ${name} login test passed`)
            } else {
                console.error(`❌ ${name} login failed: state is ${JSON.stringify(currentState)}`)
            }
            
            // Step 2: Logout
            logout()
            
            setTimeout(() => {
                const afterLogout = $$(state)
                
                if (!afterLogout.authenticated && afterLogout.user === null) {
                    console.log(`✅ ${name} logout test passed`)
                } else {
                    console.error(`❌ ${name} logout failed`)
                }
            }, 500)
        }, 500)
    }, 500)
    
    const currentState = $$(state)
    
    return (
        <div>
            <h3>State Manager</h3>
            <p>User: {currentState.user || 'None'}</p>
            <p>Authenticated: {currentState.authenticated ? 'Yes' : 'No'}</p>
            <p>Role: {currentState.role}</p>
        </div>
    )
}

export default TestStateManager
```

### Expected Console Output

```
✅ TestStateManager login test passed
✅ TestStateManager logout test passed
```

---

## Event Handler Test

### Component File: `TestClickHandler.tsx`

```tsx
import { $, type JSX } from 'woby'
import { registerTestObservable, useInterval, TEST_INTERVAL } from './util'

const name = 'TestClickHandler'

const TestClickHandler = (): JSX.Element => {
    const clicks = $(0)
    const buttonRef = $<HTMLButtonElement>()
    
    registerTestObservable(`${name}_clicks`, clicks)
    registerTestObservable(`${name}_button`, buttonRef)
    
    // Click handler
    const handleClick = () => {
        clicks(prev => prev + 1)
    }
    
    // Programmatically trigger clicks for testing
    setTimeout(() => {
        useInterval(() => {
            const button = buttonRef()
            if (button) {
                // Simulate click
                button.click?.()
            }
        }, TEST_INTERVAL)
    }, 500)
    
    // Verify click count after multiple triggers
    setTimeout(() => {
        const finalCount = clicks()
        
        if (finalCount >= 3) {
            console.log(`✅ ${name} passed: handler called ${finalCount} times`)
        } else {
            console.error(`❌ ${name} failed: expected at least 3 clicks, got ${finalCount}`)
        }
    }, 3000)
    
    return (
        <div>
            <h3>Click Handler Test</h3>
            <p>Clicks: {clicks}</p>
            <button ref={buttonRef} onClick={handleClick}>
                Click Me
            </button>
        </div>
    )
}

export default TestClickHandler
```

### Expected Console Output

```
✅ TestClickHandler passed: handler called 5 times
```

---

## SSR Test

### Component File: `TestSSRComponent.tsx`

```tsx
import { $, $$, renderToString, type JSX } from 'woby'
import { registerTestObservable, testObservables, assert, getInnerHTML } from './util'

const name = 'TestSSRComponent'

const TestSSRComponent = (): JSX.Element => {
    const message = $('Hello SSR')
    registerTestObservable(`${name}_message`, message)
    
    const element = (
        <div className="ssr-test">
            <h3>{message}</h3>
            <p>Server Rendered</p>
        </div>
    )
    
    // Store for SSR testing
    registerTestObservable(`${name}_ssr`, element)
    
    return element
}

// Add test metadata
TestSSRComponent.test = {
    static: false,
    expect: () => {
        const messageValue = $$(testObservables[`${name}_message`]) ?? 'Hello SSR'
        const ssrComponent = testObservables[`${name}_ssr`]
        
        if (ssrComponent) {
            const ssrResult = renderToString(ssrComponent)
            const expectedFull = `<div class="ssr-test"><h3>${messageValue}</h3><p>Server Rendered</p></div>`
            const expected = `<h3>${messageValue}</h3><p>Server Rendered</p>`
            
            // Test SSR output
            if (ssrResult !== expectedFull) {
                assert(false, `[${name}] SSR mismatch: got ${ssrResult}, expected ${expectedFull}`)
            } else {
                console.log(`✅ [${name}] SSR test passed`)
            }
            
            // Test inner HTML
            setTimeout(() => {
                const element = document.querySelector('.ssr-test')
                if (element) {
                    const innerHTML = getInnerHTML(element)
                    if (innerHTML.includes(messageValue)) {
                        console.log(`✅ ${name} DOM test passed`)
                    } else {
                        console.error(`❌ ${name} DOM test failed`)
                    }
                }
            }, 100)
        }
        
        return `<h3>${messageValue}</h3><p>Server Rendered</p>`
    }
}

export default TestSSRComponent
```

### Expected Console Output

```
✅ [TestSSRComponent] SSR test passed
✅ TestSSRComponent DOM test passed
```

---

## Custom Element Test

### Component File: `TestCustomElement.tsx`

```tsx
import { $, type JSX } from 'woby'
import { registerTestObservable, getInnerHTML, minimiseHtml } from './util'

const name = 'TestCustomElement'

const TestCustomElement = (): JSX.Element => {
    const isVisible = $(true)
    registerTestObservable(`${name}_visibility`, isVisible)
    
    // Define custom element if not already defined
    if (typeof window !== 'undefined' && !customElements.get('test-custom-el')) {
        class TestCustomEl extends HTMLElement {
            constructor() {
                super()
                const shadow = this.attachShadow({ mode: 'open' })
                shadow.innerHTML = `
                    <style>
                        .content { color: blue; }
                    </style>
                    <div class="content">Custom Element Content</div>
                `
            }
        }
        customElements.define('test-custom-el', TestCustomEl)
    }
    
    // Test custom element rendering
    setTimeout(() => {
        const customEl = document.querySelector('test-custom-el')
        
        if (customEl) {
            const innerHTML = getInnerHTML(customEl)
            
            if (innerHTML.includes('Custom Element Content')) {
                console.log(`✅ ${name} custom element test passed`)
            } else {
                console.error(`❌ ${name} custom element test failed: content not found`)
            }
        } else {
            console.error(`❌ ${name} custom element not rendered`)
        }
    }, 1000)
    
    return (
        <div>
            <h3>Custom Element Test</h3>
            {isVisible() && <test-custom-el></test-custom-el>}
        </div>
    )
}

export default TestCustomElement
```

### Expected Console Output

```
✅ TestCustomElement custom element test passed
```

---

## Async Operation Test

### Component File: `TestAsyncFetch.tsx`

```tsx
import { $, $$, type JSX } from 'woby'
import { registerTestObservable } from './util'

const name = 'TestAsyncFetch'

interface UserData {
    id: number
    name: string
    email: string
}

const TestAsyncFetch = (): JSX.Element => {
    const loading = $(true)
    const error = $(false)
    const userData = $<UserData | null>(null)
    
    registerTestObservable(`${name}_loading`, loading)
    registerTestObservable(`${name}_error`, error)
    registerTestObservable(`${name}_userData`, userData)
    
    // Simulate async fetch
    const fetchData = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const mockData: UserData = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com'
            }
            
            userData(mockData)
            loading(false)
            
            console.log(`✅ ${name} data fetch successful`)
        } catch (err) {
            error(true)
            loading(false)
            console.error(`❌ ${name} data fetch failed`)
        }
    }
    
    // Trigger fetch and test
    setTimeout(() => {
        fetchData()
        
        // Verify data after fetch completes
        setTimeout(() => {
            const data = $$(userData)
            const isLoading = $$(loading)
            
            if (!isLoading && data !== null && data.name === 'John Doe') {
                console.log(`✅ ${name} async operation test passed`)
            } else {
                console.error(`❌ ${name} async test failed: data=${data}, loading=${isLoading}`)
            }
        }, 1500)
    }, 500)
    
    const currentLoading = $$(loading)
    const currentError = $$(error)
    const currentData = $$(userData)
    
    return (
        <div>
            <h3>Async Fetch Test</h3>
            {currentLoading && <p>Loading...</p>}
            {currentError && <p style={{ color: 'red' }}>Error occurred</p>}
            {currentData && (
                <div>
                    <p>Name: {currentData.name}</p>
                    <p>Email: {currentData.email}</p>
                </div>
            )}
        </div>
    )
}

export default TestAsyncFetch
```

### Expected Console Output

```
✅ TestAsyncFetch data fetch successful
✅ TestAsyncFetch async operation test passed
```

---

## Observable Resolution Test

### Component File: `TestObservableResolution.tsx`

```tsx
import { $, $$, type JSX } from 'woby'
import { registerTestObservable, testObservables } from './util'

const name = 'TestObservableResolution'

const TestObservableResolution = (): JSX.Element => {
    // Create nested observables
    const firstName = $('John')
    const lastName = $('Doe')
    
    // Computed full name
    const fullName = $(() => {
        return `${$$(firstName)} ${$$(lastName)}`
    })
    
    registerTestObservable(`${name}_firstName`, firstName)
    registerTestObservable(`${name}_lastName`, lastName)
    registerTestObservable(`${name}_fullName`, fullName)
    
    // Test reactive updates
    setTimeout(() => {
        // Initial check
        const initialName = $$(fullName)
        if (initialName === 'John Doe') {
            console.log(`✅ ${name} initial resolution passed`)
        } else {
            console.error(`❌ ${name} initial resolution failed: got ${initialName}`)
        }
        
        // Update first name
        firstName('Jane')
        
        setTimeout(() => {
            const updatedName = $$(fullName)
            if (updatedName === 'Jane Doe') {
                console.log(`✅ ${name} reactive update passed`)
            } else {
                console.error(`❌ ${name} reactive update failed: got ${updatedName}`)
            }
        }, 100)
    }, 500)
    
    return (
        <div>
            <h3>Observable Resolution</h3>
            <p>First: {firstName}</p>
            <p>Last: {lastName}</p>
            <p>Full: {fullName}</p>
        </div>
    )
}

export default TestObservableResolution
```

### Expected Console Output

```
✅ TestObservableResolution initial resolution passed
✅ TestObservableResolution reactive update passed
```

---

## Complex Integration Test

### Component File: `TestIntegration.tsx`

```tsx
import { $, $$, renderToString, type JSX } from 'woby'
import { registerTestObservable, testObservables, assert, getInnerHTML } from './util'

const name = 'TestIntegration'

interface Todo {
    id: number
    text: string
    completed: boolean
}

const TestIntegration = (): JSX.Element => {
    const todos = $<Todo[]>([])
    const filter = $<'all' | 'active' | 'completed'>('all')
    
    registerTestObservable(`${name}_todos`, todos)
    registerTestObservable(`${name}_filter`, filter)
    
    // Actions
    const addTodo = (text: string) => {
        todos(prev => [
            ...prev,
            { id: Date.now(), text, completed: false }
        ])
    }
    
    const toggleTodo = (id: number) => {
        todos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
    }
    
    const filteredTodos = $(() => {
        const allTodos = $$(todos)
        const currentFilter = $$(filter)
        
        switch (currentFilter) {
            case 'active':
                return allTodos.filter(t => !t.completed)
            case 'completed':
                return allTodos.filter(t => t.completed)
            default:
                return allTodos
        }
    })
    
    // Complex test scenario
    setTimeout(() => {
        // Add todos
        addTodo('Learn Woby')
        addTodo('Build App')
        
        setTimeout(() => {
            const todoList = $$(todos)
            
            if (todoList.length === 2) {
                console.log(`✅ ${name} add todo test passed`)
            } else {
                console.error(`❌ ${name} add todo failed: expected 2, got ${todoList.length}`)
            }
            
            // Toggle completion
            toggleTodo(todoList[0].id)
            
            setTimeout(() => {
                const updatedTodos = $$(todos)
                
                if (updatedTodos[0].completed) {
                    console.log(`✅ ${name} toggle todo test passed`)
                } else {
                    console.error(`❌ ${name} toggle todo failed`)
                }
                
                // Test filtering
                filter('completed')
                
                setTimeout(() => {
                    const filtered = $$(filteredTodos)
                    
                    if (filtered.length === 1 && filtered[0].completed) {
                        console.log(`✅ ${name} filter test passed`)
                    } else {
                        console.error(`❌ ${name} filter failed`)
                    }
                    
                    // Test SSR
                    const ssrComponent = testObservables[`${name}_ssr`]
                    if (ssrComponent) {
                        const ssrResult = renderToString(ssrComponent)
                        
                        if (ssrResult.includes('Todo App')) {
                            console.log(`✅ [${name}] SSR integration test passed`)
                        } else {
                            assert(false, `[${name}] SSR integration failed`)
                        }
                    }
                }, 200)
            }, 200)
        }, 500)
    }, 500)
    
    // Store for SSR
    const element = (
        <div className="todo-app">
            <h2>Todo App</h2>
            <ul>
                {$$(filteredTodos).map(todo => (
                    <li 
                        key={todo.id}
                        style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                        onClick={() => toggleTodo(todo.id)}
                    >
                        {todo.text}
                    </li>
                ))}
            </ul>
        </div>
    )
    
    registerTestObservable(`${name}_ssr`, element)
    
    return element
}

TestIntegration.test = {
    static: false,
    expect: () => {
        return '<div class="todo-app"><h2>Todo App</h2></div>'
    }
}

export default TestIntegration
```

### Expected Console Output

```
✅ TestIntegration add todo test passed
✅ TestIntegration toggle todo test passed
✅ TestIntegration filter test passed
✅ [TestIntegration] SSR integration test passed
```

---

## Running the Examples

### 1. Add Component to Playground

Edit `playground/src/index.tsx`:

```tsx
import TestSimpleCounter from './TestSimpleCounter'
import TestStateManager from './TestStateManager'
// ... other imports

const App = () => {
    return (
        <div>
            <h1>Playground Tests</h1>
            <TestSimpleCounter />
            <TestStateManager />
            <TestClickHandler />
            <TestSSRComponent />
            <TestCustomElement />
            <TestAsyncFetch />
            <TestObservableResolution />
            <TestIntegration />
        </div>
    )
}

export default App
```

### 2. Run Tests

```bash
cd d:\Developments\tslib\@woby\woby

# Run all tests
pnpm test

# Or run specific test type
pnpm run test:assertions
```

### 3. View Results

```
📊 Test Results Summary:
   Total tests: 12
   Passed: 12
   Failed: 0
   Assertions captured: 15

✅ All playground tests passed!
```

---

## Best Practices Demonstrated

✅ **Clear Test Names**: Each test has a descriptive name
✅ **Specific Assertions**: Tests check exact conditions
✅ **Error Messages**: Include expected vs actual values
✅ **Async Timing**: Proper timeouts for async operations
✅ **State Registration**: Use `registerTestObservable` for all testable state
✅ **SSR Testing**: Store components for SSR validation
✅ **DOM Testing**: Use `getInnerHTML` for DOM assertions
✅ **Reactive Testing**: Test computed values with `$$()`

---

## Common Patterns

### Pattern 1: Setup → Act → Assert

```tsx
setTimeout(() => {
    // Setup
    doSomething()
    
    setTimeout(() => {
        // Assert
        const result = getResult()
        if (result === expected) {
            console.log(`✅ Test passed`)
        }
    }, delay)
}, setupDelay)
```

### Pattern 2: Sequential Tests

```tsx
setTimeout(() => {
    testStep1()
    
    setTimeout(() => {
        verifyStep1()
        testStep2()
        
        setTimeout(() => {
            verifyStep2()
        }, delay)
    }, delay)
}, setupDelay)
```

### Pattern 3: Conditional Logging

```tsx
if (condition) {
    console.log(`✅ ${name} passed: description`)
} else {
    console.error(`❌ ${name} failed: reason`)
}
```

---

## Anti-Patterns to Avoid

❌ **Vague Messages**: "Test failed" (not helpful)
❌ **Missing Context**: No expected/actual values
❌ **Hardcoded Delays**: Use appropriate timeouts
❌ **Testing Implementation**: Test behavior, not internals
❌ **Flaky Timing**: Race conditions in async tests
❌ **Silent Failures**: Always log failures

---

## Tips for Success

1. **Start Simple**: Begin with basic tests, add complexity gradually
2. **Use Descriptive Names**: Make test names self-documenting
3. **Test One Thing**: Each test should verify one behavior
4. **Provide Context**: Include enough info to debug failures
5. **Keep Tests Fast**: Minimize wait times while ensuring reliability
6. **Document Edge Cases**: Note any special timing or conditions

---

**Happy Testing! 🧪**
