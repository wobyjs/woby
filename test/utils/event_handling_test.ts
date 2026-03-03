import { $ } from '../src/soby'
import { setEventStatic, setEvent } from '../src/utils/setters'

// Simple test to verify event handling with reactive functions
function testEventHandling() {
    console.log('Testing event handling with reactive functions...\n');
    
    // Mock element
    const element: any = {
        _onclick: null,
        addEventListener: function(type: string, handler: Function) {
            this._onclick = handler;
        },
        removeEventListener: function(type: string, handler: Function) {
            if (this._onclick === handler) {
                this._onclick = null;
            }
        }
    };
    
    // Test 1: Static event handler
    console.log('Test 1: Static event handler');
    let staticCallCount = 0;
    const staticHandler = () => {
        staticCallCount++;
        console.log('  Static handler called');
    };
    
    setEventStatic(element, 'onclick', staticHandler);
    element._onclick(); // Simulate event
    console.log('  Call count:', staticCallCount);
    console.log('  Expected: 1');
    console.log('  Status:', staticCallCount === 1 ? '✅ PASS' : '❌ FAIL');
    
    // Test 2: Reactive event handler (this would be the fixed behavior)
    console.log('\nTest 2: Reactive event handler (simulated)');
    let reactiveCallCount = 0;
    const reactiveHandler = $(() => {
        reactiveCallCount++;
        console.log('  Reactive handler called');
        return () => console.log('  Event handler executed');
    });
    
    // This simulates what the fixed setEvent should do
    const resolvedHandler = reactiveHandler();
    if (resolvedHandler) {
        setEventStatic(element, 'onclick', resolvedHandler);
        element._onclick(); // Simulate event
        console.log('  Call count:', reactiveCallCount);
        console.log('  Expected: 1');
        console.log('  Status:', reactiveCallCount === 1 ? '✅ PASS' : '❌ FAIL');
    }
    
    console.log('\nEvent handling tests completed!');
}

testEventHandling();