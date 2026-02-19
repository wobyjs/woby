/**
 * Test Custom Element Comprehensive
 * 
 * Comprehensive test covering all major custom element features:
 * - Basic functionality
 * - Slots and content distribution
 * - Context API integration
 * - Nested component interactions
 * - Host element relationships
 * - Type conversion and serialization
 * - Style and attribute handling
 */
import { $, $$, customElement, defaults, createContext, useMountedContext, HtmlString, HtmlNumber, HtmlBoolean, HtmlDate } from 'woby'

// Contexts for testing
const AppContext = createContext('default-app')
const UserContext = createContext({ name: 'Anonymous', id: 0 })
const ThemeContext = createContext('light')

const useApp = () => useMountedContext(AppContext)
const useUser = () => useMountedContext(UserContext)
const useTheme = () => useMountedContext(ThemeContext)

// Comprehensive custom element
const ComprehensiveElement = defaults(() => ({
    // Basic props with different types
    title: $('Comprehensive Element', HtmlString),
    count: $(0, HtmlNumber),
    enabled: $(true, HtmlBoolean),
    created: $(new Date(), HtmlDate),
    userData: $({ name: 'Default User', role: 'guest' }, {
        toHtml: (obj) => JSON.stringify(obj),
        fromHtml: (str) => JSON.parse(str)
    }),

    // Style props
    backgroundColor: $('white'),
    borderColor: $('black'),

    // Nested props
    config: {
        debug: $(false, HtmlBoolean),
        timeout: $(5000, HtmlNumber)
    }
}), ({ title, count, enabled, created, userData, backgroundColor, borderColor, config, children }) => {
    const appContext = useApp()
    const userContext = useUser()
    const themeContext = useTheme()

    return (
        <div style={{
            border: `2px solid ${$$(borderColor)}`,
            backgroundColor: $$(backgroundColor),
            padding: '15px',
            margin: '10px',
            borderRadius: '5px'
        }}>
            <h3 style={{
                color: $$(themeContext) === 'dark' ? 'white' : 'black',
                textDecoration: $$(enabled) ? 'none' : 'line-through'
            }}>
                {$$(title)}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                    <h4>Props:</h4>
                    <ul>
                        <li>Count: {$$(count)}</li>
                        <li>Enabled: {$$(enabled) ? 'Yes' : 'No'}</li>
                        <li>Created: {$$(created).toLocaleString()}</li>
                        <li>User Data: {() => JSON.stringify($$(userData))}</li>
                    </ul>
                </div>

                <div>
                    <h4>Context:</h4>
                    <ul>
                        <li>App: {$$(appContext)}</li>
                        <li>User: {() => $$(userContext).name} (ID: {() => $$(userContext).id})</li>
                        <li>Theme: {$$(themeContext)}</li>
                    </ul>
                </div>
            </div>

            <div style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#f0f0f0',
                border: '1px dashed #999'
            }}>
                <h4>Slot Content:</h4>
                {children ? children : <p style={{ color: 'gray' }}>No slot content provided</p>}
            </div>

            <div style={{ marginTop: '10px' }}>
                <h4>Config:</h4>
                <p>Debug: {$$($$(config).debug) ? 'Enabled' : 'Disabled'}</p>
                <p>Timeout: {$$($$(config).timeout)}ms</p>
            </div>
        </div>
    )
})

// Context provider element
const ContextProviderElement = defaults(() => ({
    appName: $('Default App'),
    userName: $('Default User'),
    userId: $(0, HtmlNumber),
    theme: $('light')
}), ({ appName, userName, userId, theme, children }) => {
    const userValue = { name: userName, id: userId }

    return (
        <div style={{
            border: '3px solid purple',
            padding: '20px',
            margin: '15px',
            backgroundColor: '#f8f0ff'
        }}>
            <h2>Context Provider: {$$(appName)}</h2>
            <AppContext.Provider value={appName}>
                <UserContext.Provider value={userValue}>
                    <ThemeContext.Provider value={theme}>
                        <div style={{ marginLeft: '20px' }}>
                            {children}
                        </div>
                    </ThemeContext.Provider>
                </UserContext.Provider>
            </AppContext.Provider>
        </div>
    )
})

// Slot demonstration element
const SlotDemoElement = defaults(() => ({
    header: $('Default Header'),
    showFooter: $(true, HtmlBoolean)
}), ({ header, showFooter, children }) => {
    return (
        <div style={{
            border: '2px solid teal',
            padding: '15px',
            margin: '10px',
            backgroundColor: '#f0fff8'
        }}>
            <header style={{
                backgroundColor: '#008080',
                color: 'white',
                padding: '8px',
                marginBottom: '10px',
                borderRadius: '3px'
            }}>
                <h3>{$$(header)}</h3>
            </header>

            <main style={{ minHeight: '50px' }}>
                {children ? children : <p style={{ color: 'gray', fontStyle: 'italic' }}>No main content provided</p>}
            </main>

            {$$(showFooter) && (
                <footer style={{
                    backgroundColor: '#e0e0e0',
                    padding: '5px',
                    marginTop: '10px',
                    fontSize: '0.8em',
                    textAlign: 'center'
                }}>
                    Footer Content
                </footer>
            )}
        </div>
    )
})

// Register custom elements
customElement('comprehensive-element', ComprehensiveElement)
customElement('context-provider-element', ContextProviderElement)
customElement('slot-demo-element', SlotDemoElement)

// Test component
const TestCustomElementComprehensive = () => {
    const appTitle = $('Woby Comprehensive Test')
    const user = $(123)
    const darkMode = $(false)

    return (
        <div>
            <h1>Comprehensive Custom Element Test</h1>
            <p>Testing all major custom element features in one place</p>

            {/* Context providers */}
            <AppContext.Provider value={appTitle}>
                <UserContext.Provider value={{ name: 'Test User', id: 456 }}>
                    <ThemeContext.Provider value={darkMode ? 'dark' : 'light'}>

                        {/* Basic usage */}
                        <h2>1. Basic Custom Element Usage</h2>

                        {/* TSX usage */}
                        <ComprehensiveElement
                            title="TSX Comprehensive Element"
                            count={99}
                            enabled={true}
                            backgroundColor="#ffeeee"
                            borderColor="red"
                        >
                            <p>TSX-provided slot content</p>
                            <button>Slot Button</button>
                        </ComprehensiveElement>

                        {/* HTML usage */}
                        <comprehensive-element
                            title="HTML Comprehensive Element"
                            count="42"
                            enabled="false"
                            background-color="#eeffee"
                            border-color="green"
                            user-data='{"name": "HTML User", "role": "admin"}'
                            style$margin-top="20px"
                        >
                            <p>HTML-provided slot content</p>
                            <ul>
                                <li>Item 1</li>
                                <li>Item 2</li>
                            </ul>
                        </comprehensive-element>

                        {/* Context provider element */}
                        <h2>2. Context Provider Element</h2>
                        <context-provider-element
                            app-name="Custom Provider App"
                            user-name="HTML User"
                            user-id="789"
                            theme="dark"
                        >
                            <comprehensive-element title="Context Consumer Element">
                                <p>Content inside context provider</p>
                            </comprehensive-element>
                        </context-provider-element>

                        {/* Slot demonstration */}
                        <h2>3. Slot Demonstration</h2>
                        <SlotDemoElement header="Custom Header" show-footer="true">
                            <p>Main content area</p>
                            <div style={{ backgroundColor: 'yellow', padding: '5px' }}>
                                <p>Nested content</p>
                            </div>
                        </SlotDemoElement>

                        {/* Nested complex scenario */}
                        <h2>4. Complex Nested Scenario</h2>
                        <ContextProviderElement
                            appName="Nested Test App"
                            userName="Nested User"
                            userId={999}
                            theme="light"
                        >
                            <SlotDemoElement header="Nested Slot Header">
                                <ComprehensiveElement
                                    title="Deeply Nested Element"
                                    count={123}
                                    userData={{ name: 'Nested User', role: 'power' }}
                                >
                                    <p>Deeply nested slot content</p>
                                    <comprehensive-element
                                        title="HTML Nested Element"
                                        count="456"
                                        enabled="true"
                                    >
                                        <p>Mixed nesting level</p>
                                    </comprehensive-element>
                                </ComprehensiveElement>
                            </SlotDemoElement>
                        </ContextProviderElement>

                        {/* Type conversion test */}
                        <h2>5. Type Conversion Test</h2>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <comprehensive-element
                                title="Boolean Test"
                                enabled="true"
                                count="1"
                            />
                            <comprehensive-element
                                title="Boolean Test 2"
                                enabled="false"
                                count="0"
                            />
                            <comprehensive-element
                                title="Number Test"
                                count="999"
                                enabled="true"
                            />
                        </div>

                        {/* Context inheritance verification */}
                        <h2>6. Context Inheritance Verification</h2>
                        <div>
                            <p>Current context values:</p>
                            <ul>
                                <li>App: {$$(appTitle)}</li>
                                <li>User ID: {$$(user)}</li>
                                <li>Theme: {darkMode ? 'dark' : 'light'}</li>
                            </ul>

                            <ComprehensiveElement title="Context Verification Element" />
                        </div>

                    </ThemeContext.Provider>
                </UserContext.Provider>
            </AppContext.Provider>
        </div>
    )
}

export default TestCustomElementComprehensive