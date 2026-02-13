/* IMPORT */

import * as Woby from 'woby'
import type { JSX } from 'woby'
import { $, render } from 'woby'

// Import all existing test components
import TestABCD from './src/TestABCD'
import TestAttributeBooleanStatic from './src/TestAttributeBooleanStatic'
import TestAttributeFunction from './src/TestAttributeFunction'
import TestAttributeFunctionBoolean from './src/TestAttributeFunctionBoolean'
import TestAttributeObservable from './src/TestAttributeObservable'
import TestAttributeObservableBoolean from './src/TestAttributeObservableBoolean'
import TestAttributeRemoval from './src/TestAttributeRemoval'
import TestAttributeStatic from './src/TestAttributeStatic'
import TestBigIntFunction from './src/TestBigIntFunction'
import TestBigIntObservable from './src/TestBigIntObservable'
import TestBigIntRemoval from './src/TestBigIntRemoval'
import TestBigIntStatic from './src/TestBigIntStatic'
import TestBooleanFunction from './src/TestBooleanFunction'
import TestBooleanObservable from './src/TestBooleanObservable'
import TestBooleanRemoval from './src/TestBooleanRemoval'
import TestBooleanStatic from './src/TestBooleanStatic'
import TestChildrenBoolean from './src/TestChildrenBoolean'
import TestChildrenSymbol from './src/TestChildrenSymbol'
import TestClassNameFunction from './src/TestClassNameFunction'
import TestClassNameObservable from './src/TestClassNameObservable'
import TestClassNameStatic from './src/TestClassNameStatic'
import TestClassFunction from './src/TestClassFunction'
import TestClassFunctionString from './src/TestClassFunctionString'
import TestClassObservable from './src/TestClassObservable'
import TestClassObservableString from './src/TestClassObservableString'
import TestClassRemoval from './src/TestClassRemoval'
import TestClassRemovalString from './src/TestClassRemovalString'
import TestClassStatic from './src/TestClassStatic'
import TestClassStaticString from './src/TestClassStaticString'
import TestForUnkeyedRandom from './src/TestForUnkeyedRandom'
import TestFragmentStatic from './src/TestFragmentStatic'
import TestFragmentStaticComponent from './src/TestFragmentStaticComponent'
import TestFragmentStaticDeep from './src/TestFragmentStaticDeep'
import TestIdFunction from './src/TestIdFunction'
import TestIdObservable from './src/TestIdObservable'
import TestIdRemoval from './src/TestIdRemoval'
import TestIdStatic from './src/TestIdStatic'
import TestIfChildrenFunction from './src/TestIfChildrenFunction'
import TestIfChildrenFunctionObservable from './src/TestIfChildrenFunctionObservable'
import TestIfChildrenObservable from './src/TestIfChildrenObservable'
import TestIfChildrenObservableStatic from './src/TestIfChildrenObservableStatic'
import TestNullFunction from './src/TestNullFunction'
import TestNullObservable from './src/TestNullObservable'
import TestNullRemoval from './src/TestNullRemoval'
import TestNullStatic from './src/TestNullStatic'
import TestNumberFunction from './src/TestNumberFunction'
import TestNumberObservable from './src/TestNumberObservable'
import TestNumberRemoval from './src/TestNumberRemoval'
import TestNumberStatic from './src/TestNumberStatic'
import TestSimpleExpect from './src/TestSimpleExpect'
import TestStringFunction from './src/TestStringFunction'
import TestStringObservable from './src/TestStringObservable'
import TestStringObservableStatic from './src/TestStringObservableStatic'
import TestStringObservableDeepStatic from './src/TestStringObservableDeepStatic'
import TestStringRemoval from './src/TestStringRemoval'
import TestStringStatic from './src/TestStringStatic'
import TestUndefinedFunction from './src/TestUndefinedFunction'
import TestUndefinedObservable from './src/TestUndefinedObservable'
import TestUndefinedRemoval from './src/TestUndefinedRemoval'
import TestUndefinedStatic from './src/TestUndefinedStatic'

globalThis.Woby = Woby

/* MAIN */

const tests = [
    TestSimpleExpect,
    TestNullStatic,
    TestNullObservable,
    TestNullFunction,
    TestNullRemoval,
    TestUndefinedStatic,
    TestUndefinedObservable,
    TestUndefinedFunction,
    TestUndefinedRemoval,
    TestBooleanStatic,
    TestBooleanObservable,
    TestBooleanFunction,
    TestBooleanRemoval,
    TestBigIntStatic,
    TestBigIntObservable,
    TestBigIntFunction,
    TestBigIntRemoval,
    TestStringStatic,
    TestStringObservable,
    TestStringObservableStatic,
    TestStringObservableDeepStatic,
    TestStringFunction,
    TestStringRemoval,
    TestAttributeStatic,
    TestAttributeObservable,
    TestAttributeObservableBoolean,
    TestAttributeFunction,
    TestAttributeFunctionBoolean,
    TestAttributeRemoval,
    TestAttributeBooleanStatic,
    TestIdStatic,
    TestIdObservable,
    TestIdFunction,
    TestIdRemoval,
    TestClassNameStatic,
    TestClassNameObservable,
    TestClassNameFunction,
    TestClassStatic,
    TestClassStaticString,
    TestClassObservable,
    TestClassObservableString,
    TestClassFunction,
    TestClassFunctionString,
    TestClassRemoval,
    TestClassRemovalString,
    TestNumberStatic,
    TestNumberObservable,
    TestNumberFunction,
    TestNumberRemoval,
    TestChildrenBoolean,
    TestChildrenSymbol,
    TestIfChildrenObservable,
    TestIfChildrenObservableStatic,
    TestIfChildrenFunction,
    TestIfChildrenFunctionObservable,
    TestForUnkeyedRandom,
    TestFragmentStatic,
    TestFragmentStaticComponent,
    TestFragmentStaticDeep,
    TestABCD
]

const App = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {tests.map((TestComponent, index) => (
            <div key={`${index}`} style={{ border: "1px solid #ccc", padding: "10px" }}>
                <TestComponent />
            </div>
        ))}
    </div>
)

export default App

// Render the app
let appRendered = false
let renderTimeout = null

const renderApp = () => {
    // Clear any existing timeout
    if (renderTimeout !== null) {
        clearTimeout(renderTimeout)
        renderTimeout = null
    }

    if (appRendered) {
        console.log('App already rendered, skipping')
        return
    }

    const appElement = document.getElementById('app')
    console.log('Attempting to render app, app element:', appElement)

    if (appElement) {
        try {
            console.log('Calling render with element:', appElement)
            render(<App />, appElement)
            appRendered = true
            console.log('App rendered successfully')
        } catch (error) {
            console.error('Failed to render app:', error)
            console.error('Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack,
                element: appElement,
                elementType: typeof appElement,
                elementConstructor: appElement?.constructor?.name
            })
        }
    } else {
        console.error('App element not found')
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp)
} else {
    // Small delay to ensure DOM is fully ready
    setTimeout(renderApp, 0)
}