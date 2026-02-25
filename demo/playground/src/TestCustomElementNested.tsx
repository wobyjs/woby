/**
 * Test Custom Element Nested Components
 * 
 * Tests nested component functionality between TSX and custom elements:
 * - TSX components inside custom elements
 * - Custom elements inside TSX components
 * - Deep nesting scenarios
 * - Host element interactions
 * - Property passing through nested structures
 */
import { $, $$, customElement, defaults, HtmlString, HtmlNumber, HtmlBoolean } from 'woby'

// Leaf component - simplest custom element
const LeafElement = defaults(() => ({
    text: $('Leaf Element', HtmlString),
    number: $(0, HtmlNumber)
}), ({ text, number }) => {
    return (
        <div style={{
            border: '1px solid #ccc',
            padding: '5px',
            margin: '2px',
            backgroundColor: '#f9f9f9'
        }}>
            <small>Leaf: {$$(text)} ({$$(number)})</small>
        </div>
    )
})

// Intermediate component - contains other elements
const IntermediateElement = defaults(() => ({
    title: $('Intermediate', HtmlString),
    active: $(false, HtmlBoolean),
    count: $(0, HtmlNumber)
}), ({ title, active, count, children }) => {
    return (
        <div style={{
            border: '2px solid #666',
            padding: '10px',
            margin: '5px',
            backgroundColor: $$(active) ? '#e6f3ff' : '#fff'
        }}>
            <h4>{$$(title)} - Count: {$$(count)}</h4>
            <div style={{ marginLeft: '15px' }}>
                {children}
            </div>
        </div>
    )
})

// Root component - complex nested structure
const RootElement = defaults(() => ({
    name: $('Root Element', HtmlString),
    level: $(1, HtmlNumber),
    expanded: $(true, HtmlBoolean)
}), ({ name, level, expanded, children }) => {
    return (
        <div style={{
            border: '3px solid #333',
            padding: '15px',
            margin: '10px',
            backgroundColor: '#ffffe6'
        }}>
            <h3>Level {$$(level)}: {$$(name)}</h3>
            {$$(expanded) && (
                <div style={{ marginLeft: '20px', borderLeft: '2px dashed #999', paddingLeft: '10px' }}>
                    {children}
                </div>
            )}
        </div>
    )
})

// Special host-aware component
const HostAwareElement = defaults(() => ({
    hostInfo: $('Host Element Info', HtmlString)
}), ({ hostInfo, children }) => {
    // This would typically access host element properties
    return (
        <div style={{
            border: '2px dotted #ff6600',
            padding: '12px',
            margin: '8px',
            backgroundColor: '#fff0f0'
        }}>
            <p><strong>Host Info:</strong> {$$(hostInfo)}</p>
            <div style={{ marginTop: '8px' }}>
                {children}
            </div>
        </div>
    )
})

// Register all custom elements
customElement('leaf-element', LeafElement)
customElement('intermediate-element', IntermediateElement)
customElement('root-element', RootElement)
customElement('host-aware-element', HostAwareElement)

// Test component
const TestCustomElementNested = () => {
    const rootName = $('Main Root')
    const intermediateTitle = $('Main Intermediate')
    const leafText = $('Nested Leaf')
    const hostInfo = $('Parent Host Context')

    return (
        <div>
            <h1>Custom Element Nested Components Test</h1>

            {/* Pure TSX nesting */}
            <h2>1. Pure TSX Nesting</h2>
            <RootElement name={rootName} level={1} expanded={true}>
                <IntermediateElement title={intermediateTitle} active={true} count={42}>
                    <LeafElement text={leafText} number={100} />
                    <LeafElement text="Another Leaf" number={200} />
                </IntermediateElement>
                <LeafElement text="Direct Root Child" number={300} />
            </RootElement>

            {/* Pure Custom Element nesting (HTML attributes) */}
            <h2>2. Pure Custom Element Nesting</h2>
            <root-element name="HTML Root" level="2" expanded="true">
                <intermediate-element title="HTML Intermediate" active="false" count="15">
                    <leaf-element text="HTML Leaf 1" number="50"></leaf-element>
                    <leaf-element text="HTML Leaf 2" number="75"></leaf-element>
                </intermediate-element>
                <leaf-element text="HTML Direct Child" number="125"></leaf-element>
            </root-element>

            {/* Mixed TSX -> Custom Element */}
            <h2>3. TSX to Custom Element Nesting</h2>
            <RootElement name="TSX Root" level={3}>
                <intermediate-element title="Mixed Intermediate" active="true" count="33">
                    <LeafElement text="TSX Leaf in HTML Parent" number={44} />
                </intermediate-element>
            </RootElement>

            {/* Mixed Custom Element -> TSX */}
            <h2>4. Custom Element to TSX Nesting</h2>
            <root-element name="HTML Root with TSX Children" level="4">
                <IntermediateElement title="TSX Intermediate in HTML" count={88}>
                    <leaf-element text="HTML Leaf in TSX Parent" number="99"></leaf-element>
                </IntermediateElement>
            </root-element>

            {/* Deep nesting test */}
            <h2>5. Deep Nesting Test</h2>
            <RootElement name="Deep Root" level={1}>
                <IntermediateElement title="Level 1 Intermediate" count={1}>
                    <RootElement name="Nested Root" level={2}>
                        <IntermediateElement title="Level 2 Intermediate" count={2}>
                            <LeafElement text="Deep Leaf" number={999} />
                        </IntermediateElement>
                    </RootElement>
                </IntermediateElement>
            </RootElement>

            {/* Host-aware testing */}
            <h2>6. Host-Aware Component Testing</h2>
            <HostAwareElement hostInfo={hostInfo}>
                <RootElement name="Child of Host-Aware" level={1}>
                    <LeafElement text="Host-Aware Leaf" number={111} />
                </RootElement>
            </HostAwareElement>

            {/* Complex mixed scenario */}
            <h2>7. Complex Mixed Scenario</h2>
            <div>
                <RootElement name="Complex Root A" level={1}>
                    <intermediate-element title="HTML Intermediate A" count="10">
                        <LeafElement text="Mixed Leaf A" number={1} />
                        <leaf-element text="HTML Leaf A" number="2"></leaf-element>
                    </intermediate-element>
                </RootElement>

                <root-element name="HTML Root B" level="2">
                    <IntermediateElement title="TSX Intermediate B" count={20}>
                        <leaf-element text="HTML Leaf B" number="3"></leaf-element>
                        <LeafElement text="Mixed Leaf B" number={4} />
                    </IntermediateElement>
                </root-element>
            </div>

            {/* Property inheritance test */}
            <h2>8. Property Inheritance Test</h2>
            <div>
                <p>Testing how properties flow through nested structures:</p>
                <RootElement name="Property Test Root" level={1} expanded={false}>
                    <p>This should not be visible due to expanded=false</p>
                </RootElement>

                <IntermediateElement title="Active Test" active={true} count={999}>
                    <p>Active intermediate element content</p>
                </IntermediateElement>
            </div>
        </div>
    )
}

export default TestCustomElementNested