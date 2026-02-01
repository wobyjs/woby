// Script to identify and fix all "component not found" tests
const fs = require('fs');
const path = require('path');

// Get list of all test files
const testDir = path.join(__dirname);
const testFiles = fs.readdirSync(testDir).filter(file => file.endsWith('.spec.js'));

console.log('Test files found:', testFiles.length);

// Categorize tests based on whether they're wrapped in TestSnapshots or directly rendered
const wrappedComponents = [
    'TestNullStatic', 'TestNullObservable', 'TestNullFunction', 'TestNullRemoval',
    'TestUndefinedStatic', 'TestUndefinedObservable', 'TestUndefinedFunction', 'TestUndefinedRemoval',
    'TestBooleanStatic', 'TestBooleanObservable', 'TestBooleanFunction', 'TestBooleanRemoval',
    'TestSymbolStatic', 'TestSymbolObservable', 'TestSymbolFunction', 'TestSymbolRemoval',
    'TestNumberStatic', 'TestNumberObservable', 'TestNumberFunction', 'TestNumberRemoval',
    'TestBigIntStatic', 'TestBigIntObservable', 'TestBigIntFunction', 'TestBigIntRemoval',
    'TestStringStatic', 'TestStringObservable', 'TestStringObservableStatic', 'TestStringObservableDeepStatic',
    'TestStringFunction', 'TestStringRemoval',
    'TestAttributeStatic', 'TestAttributeObservable', 'TestAttributeFunction', 'TestAttributeFunctionBoolean',
    'TestAttributeRemoval', 'TestAttributeBooleanStatic', 'TestAttributeObservableBoolean',
    'TestIdStatic', 'TestIdObservable', 'TestIdFunction', 'TestIdRemoval',
    'TestClassNameStatic', 'TestClassNameObservable', 'TestClassNameFunction',
    'TestClassStatic', 'TestClassStaticString', 'TestClassObservable', 'TestClassObservableString',
    'TestClassFunction', 'TestClassFunctionString', 'TestClassRemoval', 'TestClassRemovalString',
    'TestClassesArrayStatic', 'TestClassesArrayStaticMultiple', 'TestClassesArrayObservable',
    'TestStyleStatic', 'TestStyleStaticNumeric', 'TestStyleStaticString', 'TestStyleStaticVariable',
    'TestStyleObservable', 'TestStyleObservableNumeric', 'TestStyleObservableString', 'TestStyleObservableVariable',
    'TestStyleFunction', 'TestStyleFunctionNumeric', 'TestStyleFunctionString', 'TestStyleFunctionVariable',
    'TestStyleRemoval',
    'TestStylesStatic', 'TestStylesObservable', 'TestStylesFunction', 'TestStylesStore',
    'TestStylesRemoval', 'TestStylesCleanup', 'TestStylesMixed',
    'TestHTMLFunctionStatic', 'TestHTMLFunctionStaticRegistry',
    'TestHTMLInnerHTMLStatic', 'TestHTMLInnerHTMLObservable', 'TestHTMLInnerHTMLFunction',
    'TestHTMLOuterHTMLStatic', 'TestHTMLOuterHTMLObservable', 'TestHTMLOuterHTMLFunction',
    'TestHTMLTextContentStatic', 'TestHTMLTextContentObservable', 'TestHTMLTextContentFunction',
    'TestHTMLDangerouslySetInnerHTMLStatic', 'TestHTMLDangerouslySetInnerHTMLObservable',
    'TestHTMLDangerouslySetInnerHTMLObservableString', 'TestHTMLDangerouslySetInnerHTMLFunction',
    'TestHTMLDangerouslySetInnerHTMLFunctionString',
    'TestDirective', 'TestDirectiveRegisterLocal', 'TestDirectiveSingleArgument', 'TestDirectiveRef',
    'TestInputForm', 'TestCheckboxIndeterminateToggle', 'TestProgressIndeterminateToggle',
    'TestSelectStaticOption', 'TestSelectStaticValue', 'TestSelectObservableOption', 'TestSelectObservableValue',
    'TestForStatic', 'TestForObservables', 'TestForObservablesStatic', 'TestForFunctionObservables',
    'TestForRandom', 'TestForFallbackStatic', 'TestForFallbackObservable', 'TestForFallbackObservableStatic',
    'TestForFallbackFunction', 'TestForUnkeyedStatic', 'TestForUnkeyedObservables', 'TestForUnkeyedObservablesStatic',
    'TestForUnkeyedFunctionObservables', 'TestForUnkeyedRandom', 'TestForUnkeyedRandomOnlyChild',
    'TestForUnkeyedFallbackStatic', 'TestForUnkeyedFallbackObservable', 'TestForUnkeyedFallbackObservableStatic',
    'TestForUnkeyedFallbackFunction', 'TestFragmentStatic', 'TestFragmentStaticComponent', 'TestFragmentStaticDeep',
    'TestErrorBoundary', 'TestErrorBoundaryChildrenObservableStatic', 'TestErrorBoundaryChildrenFunction',
    'TestErrorBoundaryFallbackObservableStatic', 'TestErrorBoundaryFallbackFunction',
    'TestChildren', 'TestRef', 'TestRefs', 'TestRefsNested', 'TestRefUnmounting', 'TestRefContext',
    'TestRefUntrack', 'TestPromiseResolved', 'TestPromiseRejected', 'TestSVGStatic', 'TestSVGStaticCamelCase',
    'TestSVGObservable', 'TestSVGFunction', 'TestSVGStyleObject', 'TestSVGStyleString', 'TestSVGClassObject',
    'TestSVGClassString', 'TestSVGAttributeRemoval', 'TestTemplateExternal', 'TestTemplateSVG',
    'TestContextComponents', 'TestContextHook', 'TestPortalStatic', 'TestPortalObservable', 'TestPortalRemoval',
    'TestPortalMountObservable', 'TestPortalWhenObservable', 'TestPortalWrapperStatic', 'TestResourceFallbackValue',
    'TestResourceFallbackLatest', 'TestSuspenseAlwaysValue', 'TestSuspenseAlwaysLatest', 'TestSuspenseNever',
    'TestSuspenseNeverRead', 'TestSuspenseObservable', 'TestSuspenseWhen', 'TestSuspenseAlive',
    'TestSuspenseChildrenObservableStatic', 'TestSuspenseChildrenFunction', 'TestSuspenseFallbackObservableStatic',
    'TestSuspenseFallbackFunction', 'TestLazy', 'TestNestedArrays', 'TestNestedIfs', 'TestNestedIfsLazy',
    'TestHMRFor'
];

const directlyRenderedComponents = [
    'TestPropertyCheckedStatic', 'TestPropertyCheckedObservable', 'TestPropertyCheckedFunction', 'TestPropertyCheckedRemoval',
    'TestPropertyValueStatic', 'TestPropertyValueObservable', 'TestPropertyValueFunction', 'TestPropertyValueRemoval',
    'TestInputLabelFor',
    'TestEventClickStatic', 'TestEventClickObservable', 'TestEventClickRemoval',
    'TestEventClickCaptureStatic', 'TestEventClickCaptureObservable', 'TestEventClickCaptureRemoval',
    'TestEventClickAndClickCaptureStatic', 'TestEventClickStopPropagation', 'TestEventClickStopImmediatePropagation',
    'TestEventEnterStopPropagation', 'TestEventEnterStopImmediatePropagation', 'TestEventEnterAndEnterCaptureStatic',
    'TestEventMiddleClickStatic', 'TestEventMiddleClickCaptureStatic', 'TestEventTargetCurrentTarget',
    'TestCleanupInner', 'TestForObservableObservables', 'TestForUnkeyedObservableObservables',
    'TestSVGStaticComplex'
];

console.log('Wrapped components:', wrappedComponents.length);
console.log('Directly rendered components:', directlyRenderedComponents.length);