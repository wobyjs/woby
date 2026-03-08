/* IMPORT */

import * as Woby from 'woby'
import type { JSX } from 'woby'
import { $, DEBUGGER, render, createContext, useContext, Dynamic, createDirective, useEffect, useMemo, store, ErrorBoundary, For, If, KeepAlive, lazy, Suspense, useTimeout, Portal, usePromise, hmr, useResource, Ternary, Switch, renderToString } from 'woby'
import { random, randomColor } from './src/util'

DEBUGGER.debug = true
// Assign individual exports to global scope
globalThis.$ = $
globalThis.render = render
globalThis.createContext = createContext
globalThis.useContext = useContext
globalThis.Dynamic = Dynamic
globalThis.createDirective = createDirective
globalThis.useEffect = useEffect
globalThis.useMemo = useMemo
globalThis.random = random
globalThis.randomColor = randomColor
globalThis.store = store
globalThis.ErrorBoundary = ErrorBoundary
globalThis.For = For
globalThis.If = If
globalThis.KeepAlive = KeepAlive
globalThis.lazy = lazy
globalThis.Suspense = Suspense
globalThis.useTimeout = useTimeout
globalThis.Portal = Portal
globalThis.usePromise = usePromise
globalThis.hmr = hmr
globalThis.useResource = useResource
globalThis.Ternary = Ternary
globalThis.Switch = Switch
globalThis.renderToString = renderToString

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
import TestCheckboxIndeterminateToggle from './src/TestCheckboxIndeterminateToggle'
import TestChildOverReexecution from './src/TestChildOverReexecution'
import TestChildren from './src/TestChildren'
import TestChildrenBoolean from './src/TestChildrenBoolean'
import TestChildrenSymbol from './src/TestChildrenSymbol'
import TestClassesArrayCleanup from './src/TestClassesArrayCleanup'
import TestClassesArrayFunction from './src/TestClassesArrayFunction'
import TestClassesArrayFunctionMultiple from './src/TestClassesArrayFunctionMultiple'
import TestClassesArrayFunctionValue from './src/TestClassesArrayFunctionValue'
import TestClassesArrayNestedStatic from './src/TestClassesArrayNestedStatic'
import TestClassesArrayObservable from './src/TestClassesArrayObservable'
import TestClassesArrayObservableMultiple from './src/TestClassesArrayObservableMultiple'
import TestClassesArrayObservableValue from './src/TestClassesArrayObservableValue'
import TestClassesArrayRemoval from './src/TestClassesArrayRemoval'
import TestClassesArrayRemovalMultiple from './src/TestClassesArrayRemovalMultiple'
import TestClassesArrayStatic from './src/TestClassesArrayStatic'
import TestClassesArrayStaticMultiple from './src/TestClassesArrayStaticMultiple'
import TestClassesArrayStore from './src/TestClassesArrayStore'
import TestClassesArrayStoreMultiple from './src/TestClassesArrayStoreMultiple'
import TestClassesObjectCleanup from './src/TestClassesObjectCleanup'
import TestClassesObjectFunction from './src/TestClassesObjectFunction'
import TestClassesObjectFunctionMultiple from './src/TestClassesObjectFunctionMultiple'
import TestClassesObjectObservable from './src/TestClassesObjectObservable'
import TestClassesObjectObservableMultiple from './src/TestClassesObjectObservableMultiple'
import TestClassesObjectRemoval from './src/TestClassesObjectRemoval'
import TestClassesObjectRemovalMultiple from './src/TestClassesObjectRemovalMultiple'
import TestClassesObjectStatic from './src/TestClassesObjectStatic'
import TestClassesObjectStaticMultiple from './src/TestClassesObjectStaticMultiple'
import TestClassesObjectStore from './src/TestClassesObjectStore'
import TestClassesObjectStoreMultiple from './src/TestClassesObjectStoreMultiple'
import TestClassFunction from './src/TestClassFunction'
import TestClassFunctionString from './src/TestClassFunctionString'
import TestClassNameFunction from './src/TestClassNameFunction'
import TestClassNameObservable from './src/TestClassNameObservable'
import TestClassNameStatic from './src/TestClassNameStatic'
import TestClassObservable from './src/TestClassObservable'
import TestClassObservableString from './src/TestClassObservableString'
import TestClassRemoval from './src/TestClassRemoval'
import TestClassRemovalString from './src/TestClassRemovalString'
import TestClassStatic from './src/TestClassStatic'
import TestClassStaticString from './src/TestClassStaticString'
import TestCleanupInner from './src/TestCleanupInner'
import TestCleanupInnerPortal from './src/TestCleanupInnerPortal'
import TestComponentFunction from './src/TestComponentFunction'
import TestComponentObservable from './src/TestComponentObservable'
import TestComponentObservableDirect from './src/TestComponentObservableDirect'
import TestComponentStatic from './src/TestComponentStatic'
import TestComponentStaticProps from './src/TestComponentStaticProps'
import TestComponentStaticRenderProps from './src/TestComponentStaticRenderProps'
import TestComponentStaticRenderState from './src/TestComponentStaticRenderState'
import TestContextComponents from './src/TestContextComponents'
import TestContextDynamicContext from './src/TestContextDynamicContext'
import TestContextHook from './src/TestContextHook'
import TestDirective from './src/TestDirective'
import TestDirectiveRef from './src/TestDirectiveRef'
import TestDirectiveRegisterLocal from './src/TestDirectiveRegisterLocal'
import TestDirectiveSingleArgument from './src/TestDirectiveSingleArgument'
import TestDynamicFunctionComponent from './src/TestDynamicFunctionComponent'
import TestDynamicFunctionProps from './src/TestDynamicFunctionProps'
import TestDynamicHeading from './src/TestDynamicHeading'
import TestDynamicObservableChildren from './src/TestDynamicObservableChildren'
import TestDynamicObservableComponent from './src/TestDynamicObservableComponent'
import TestDynamicObservableProps from './src/TestDynamicObservableProps'
import TestDynamicStoreProps from './src/TestDynamicStoreProps'
import TestErrorBoundary from './src/TestErrorBoundary'
import TestErrorBoundaryNoError from './src/TestErrorBoundaryNoError'
import TestErrorBoundaryChildrenFunction from './src/TestErrorBoundaryChildrenFunction'
import TestErrorBoundaryChildrenObservableStatic from './src/TestErrorBoundaryChildrenObservableStatic'
import TestErrorBoundaryFallbackFunction from './src/TestErrorBoundaryFallbackFunction'
import TestErrorBoundaryFallbackObservableStatic from './src/TestErrorBoundaryFallbackObservableStatic'
import TestEventClickAndClickCaptureStatic from './src/TestEventClickAndClickCaptureStatic'
import TestEventClickCaptureObservable from './src/TestEventClickCaptureObservable'
import TestEventClickCaptureRemoval from './src/TestEventClickCaptureRemoval'
import TestEventClickCaptureStatic from './src/TestEventClickCaptureStatic'
import TestEventClickObservable from './src/TestEventClickObservable'
import TestEventClickRemoval from './src/TestEventClickRemoval'
import TestEventClickStatic from './src/TestEventClickStatic'
import TestEventClickStopImmediatePropagation from './src/TestEventClickStopImmediatePropagation'
import TestEventClickStopPropagation from './src/TestEventClickStopPropagation'
import TestEventEnterAndEnterCaptureStatic from './src/TestEventEnterAndEnterCaptureStatic'
import TestEventEnterStopImmediatePropagation from './src/TestEventEnterStopImmediatePropagation'
import TestEventEnterStopPropagation from './src/TestEventEnterStopPropagation'
import TestEventMiddleClickCaptureStatic from './src/TestEventMiddleClickCaptureStatic'
import TestEventMiddleClickStatic from './src/TestEventMiddleClickStatic'
import TestEventTargetCurrentTarget from './src/TestEventTargetCurrentTarget'
import TestForFallbackFunction from './src/TestForFallbackFunction'
import TestForFallbackObservable from './src/TestForFallbackObservable'
import TestForFallbackObservableStatic from './src/TestForFallbackObservableStatic'
import TestForFallbackStatic from './src/TestForFallbackStatic'
import TestForFunctionObservables from './src/TestForFunctionObservables'
import TestForObservableObservables from './src/TestForObservableObservables'
import TestForObservables from './src/TestForObservables'
import TestForObservablesStatic from './src/TestForObservablesStatic'
import TestForRandom from './src/TestForRandom'
import TestForRandomOnlyChild from './src/TestForRandomOnlyChild'
import TestForStatic from './src/TestForStatic'
import TestForUnkeyedFallbackFunction from './src/TestForUnkeyedFallbackFunction'
import TestForUnkeyedFallbackObservable from './src/TestForUnkeyedFallbackObservable'
import TestForUnkeyedFallbackObservableStatic from './src/TestForUnkeyedFallbackObservableStatic'
import TestForUnkeyedFallbackStatic from './src/TestForUnkeyedFallbackStatic'
import TestForUnkeyedFunctionObservables from './src/TestForUnkeyedFunctionObservables'
import TestForUnkeyedObservableObservables from './src/TestForUnkeyedObservableObservables'
import TestForUnkeyedObservables from './src/TestForUnkeyedObservables'
import TestForUnkeyedObservablesStatic from './src/TestForUnkeyedObservablesStatic'
import TestForUnkeyedRandom from './src/TestForUnkeyedRandom'
import TestForUnkeyedRandomOnlyChild from './src/TestForUnkeyedRandomOnlyChild'
import TestForUnkeyedStatic from './src/TestForUnkeyedStatic'
import TestFragmentStatic from './src/TestFragmentStatic'
import TestFragmentStaticComponent from './src/TestFragmentStaticComponent'
import TestFragmentStaticDeep from './src/TestFragmentStaticDeep'
import TestHTMLDangerouslySetInnerHTMLFunction from './src/TestHTMLDangerouslySetInnerHTMLFunction'
import TestHTMLDangerouslySetInnerHTMLFunctionString from './src/TestHTMLDangerouslySetInnerHTMLFunctionString'
import TestHTMLDangerouslySetInnerHTMLObservable from './src/TestHTMLDangerouslySetInnerHTMLObservable'
import TestHTMLDangerouslySetInnerHTMLObservableString from './src/TestHTMLDangerouslySetInnerHTMLObservableString'
import TestHTMLDangerouslySetInnerHTMLStatic from './src/TestHTMLDangerouslySetInnerHTMLStatic'
import TestHTMLFunctionStatic from './src/TestHTMLFunctionStatic'
import TestHTMLFunctionStaticRegistry from './src/TestHTMLFunctionStaticRegistry'
import TestHTMLInnerHTMLFunction from './src/TestHTMLInnerHTMLFunction'
import TestHTMLInnerHTMLObservable from './src/TestHTMLInnerHTMLObservable'
import TestHTMLInnerHTMLStatic from './src/TestHTMLInnerHTMLStatic'
import TestHTMLOuterHTMLFunction from './src/TestHTMLOuterHTMLFunction'
import TestHTMLOuterHTMLObservable from './src/TestHTMLOuterHTMLObservable'
import TestHTMLOuterHTMLStatic from './src/TestHTMLOuterHTMLStatic'
import TestHTMLTextContentFunction from './src/TestHTMLTextContentFunction'
import TestHTMLTextContentObservable from './src/TestHTMLTextContentObservable'
import TestHTMLTextContentStatic from './src/TestHTMLTextContentStatic'
import TestIdFunction from './src/TestIdFunction'
import TestIdObservable from './src/TestIdObservable'
import TestIdRemoval from './src/TestIdRemoval'
import TestIdStatic from './src/TestIdStatic'
import TestIfChildrenFunction from './src/TestIfChildrenFunction'
import TestIfChildrenFunctionObservable from './src/TestIfChildrenFunctionObservable'
import TestIfChildrenObservable from './src/TestIfChildrenObservable'
import TestIfChildrenObservableStatic from './src/TestIfChildrenObservableStatic'
import TestIfFallbackFunction from './src/TestIfFallbackFunction'
import TestIfFallbackObservable from './src/TestIfFallbackObservable'
import TestIfFallbackObservableStatic from './src/TestIfFallbackObservableStatic'
import TestIfFallbackStatic from './src/TestIfFallbackStatic'
import TestIfFunction from './src/TestIfFunction'
import TestIfFunctionUntracked from './src/TestIfFunctionUntracked'
import TestIfFunctionUntrackedNarrowed from './src/TestIfFunctionUntrackedNarrowed'
import TestIfFunctionUntrackedUnnarrowed from './src/TestIfFunctionUntrackedUnnarrowed'
import TestIfNestedFunctionNarrowed from './src/TestIfNestedFunctionNarrowed'
import TestIfNestedFunctionUnnarrowed from './src/TestIfNestedFunctionUnnarrowed'
import TestIfObservable from './src/TestIfObservable'
import TestIfRace from './src/TestIfRace'
import TestIfStatic from './src/TestIfStatic'
import TestInputForm from './src/TestInputForm'
import TestInputLabelFor from './src/TestInputLabelFor'
import TestKeepAliveObservable from './src/TestKeepAliveObservable'
import TestKeepAliveStatic from './src/TestKeepAliveStatic'
import TestLazy from './src/TestLazy'
import TestNestedArrays from './src/TestNestedArrays'
import TestNestedIfs from './src/TestNestedIfs'
import TestNestedIfsLazy from './src/TestNestedIfsLazy'
import TestNullFunction from './src/TestNullFunction'
import TestNullObservable from './src/TestNullObservable'
import TestNullRemoval from './src/TestNullRemoval'
import TestNullStatic from './src/TestNullStatic'
import TestNumberFunction from './src/TestNumberFunction'
import TestNumberObservable from './src/TestNumberObservable'
import TestNumberRemoval from './src/TestNumberRemoval'
import TestNumberStatic from './src/TestNumberStatic'
import TestPortalMountObservable from './src/TestPortalMountObservable'
import TestPortalObservable from './src/TestPortalObservable'
import TestPortalRemoval from './src/TestPortalRemoval'
import TestPortalStatic from './src/TestPortalStatic'
import TestPortalWhenObservable from './src/TestPortalWhenObservable'
import TestPortalWrapperStatic from './src/TestPortalWrapperStatic'
import TestProgressIndeterminateToggle from './src/TestProgressIndeterminateToggle'
import TestPromiseRejected from './src/TestPromiseRejected'
import TestPromiseResolved from './src/TestPromiseResolved'
import TestPropertyCheckedFunction from './src/TestPropertyCheckedFunction'
import TestPropertyCheckedObservable from './src/TestPropertyCheckedObservable'
import TestPropertyCheckedRemoval from './src/TestPropertyCheckedRemoval'
import TestPropertyCheckedStatic from './src/TestPropertyCheckedStatic'
import TestPropertyValueFunction from './src/TestPropertyValueFunction'
import TestPropertyValueObservable from './src/TestPropertyValueObservable'
import TestPropertyValueRemoval from './src/TestPropertyValueRemoval'
import TestPropertyValueStatic from './src/TestPropertyValueStatic'
import TestRef from './src/TestRef'
import TestRefContext from './src/TestRefContext'
import TestRefs from './src/TestRefs'
import TestRefsNested from './src/TestRefsNested'
import TestRefUnmounting from './src/TestRefUnmounting'
import TestRefUntrack from './src/TestRefUntrack'
import TestRenderToString from './src/TestRenderToString'
import TestRenderToStringNested from './src/TestRenderToStringNested'
import TestRenderToStringSuspense from './src/TestRenderToStringSuspense'
import TestRenderToStringSuspenseNested from './src/TestRenderToStringSuspenseNested'
import TestResourceFallbackLatest from './src/TestResourceFallbackLatest'
import TestResourceFallbackValue from './src/TestResourceFallbackValue'
import TestSelectObservableOption from './src/TestSelectObservableOption'
import TestSelectObservableValue from './src/TestSelectObservableValue'
import TestSelectStaticOption from './src/TestSelectStaticOption'
import TestSelectStaticValue from './src/TestSelectStaticValue'
import TestSimpleExpect from './src/TestSimpleExpect'
import TestStringFunction from './src/TestStringFunction'
import TestStringObservable from './src/TestStringObservable'
import TestStringObservableDeepStatic from './src/TestStringObservableDeepStatic'
import TestStringObservableStatic from './src/TestStringObservableStatic'
import TestStringRemoval from './src/TestStringRemoval'
import TestStringStatic from './src/TestStringStatic'
import TestStyleFunction from './src/TestStyleFunction'
import TestStyleFunctionNumeric from './src/TestStyleFunctionNumeric'
import TestStyleFunctionString from './src/TestStyleFunctionString'
import TestStyleFunctionVariable from './src/TestStyleFunctionVariable'
import TestStyleObservable from './src/TestStyleObservable'
import TestStyleObservableNumeric from './src/TestStyleObservableNumeric'
import TestStyleObservableString from './src/TestStyleObservableString'
import TestStyleObservableVariable from './src/TestStyleObservableVariable'
import TestStyleRemoval from './src/TestStyleRemoval'
import TestStylesCleanup from './src/TestStylesCleanup'
import TestStylesFunction from './src/TestStylesFunction'
import TestStylesMixed from './src/TestStylesMixed'
import TestStylesObservable from './src/TestStylesObservable'
import TestStylesRemoval from './src/TestStylesRemoval'
import TestStylesStatic from './src/TestStylesStatic'
import TestStylesStore from './src/TestStylesStore'
import TestStyleStatic from './src/TestStyleStatic'
import TestStyleStaticNumeric from './src/TestStyleStaticNumeric'
import TestStyleStaticString from './src/TestStyleStaticString'
import TestStyleStaticVariable from './src/TestStyleStaticVariable'
import TestSuspenseAlive from './src/TestSuspenseAlive'
import TestSuspenseAlwaysLatest from './src/TestSuspenseAlwaysLatest'
import TestSuspenseAlwaysValue from './src/TestSuspenseAlwaysValue'
import TestSuspenseChildrenFunction from './src/TestSuspenseChildrenFunction'
import TestSuspenseChildrenObservableStatic from './src/TestSuspenseChildrenObservableStatic'
import TestSuspenseCleanup from './src/TestSuspenseCleanup'
import TestSuspenseFallbackFunction from './src/TestSuspenseFallbackFunction'
import TestSuspenseFallbackObservableStatic from './src/TestSuspenseFallbackObservableStatic'
import TestSuspenseMiddleman from './src/TestSuspenseMiddleman'
import TestSuspenseNever from './src/TestSuspenseNever'
import TestSuspenseNeverRead from './src/TestSuspenseNeverRead'
import TestSuspenseObservable from './src/TestSuspenseObservable'
import TestSuspenseWhen from './src/TestSuspenseWhen'
import TestSVGAttributeRemoval from './src/TestSVGAttributeRemoval'
import TestSVGClassObject from './src/TestSVGClassObject'
import TestSVGClassString from './src/TestSVGClassString'
import TestSVGFunction from './src/TestSVGFunction'
import TestSVGObservable from './src/TestSVGObservable'
import TestSVGStatic from './src/TestSVGStatic'
import TestSVGStaticCamelCase from './src/TestSVGStaticCamelCase'
import TestSVGStaticComplex from './src/TestSVGStaticComplex'
import TestSVGStyleObject from './src/TestSVGStyleObject'
import TestSVGStyleString from './src/TestSVGStyleString'
import TestSwitchCaseFunction from './src/TestSwitchCaseFunction'
import TestSwitchCaseObservableStatic from './src/TestSwitchCaseObservableStatic'
import TestSwitchDefaultFunction from './src/TestSwitchDefaultFunction'
import TestSwitchDefaultObservableStatic from './src/TestSwitchDefaultObservableStatic'
import TestSwitchFallbackFunction from './src/TestSwitchFallbackFunction'
import TestSwitchFallbackObservableStatic from './src/TestSwitchFallbackObservableStatic'
import TestSwitchFunction from './src/TestSwitchFunction'
import TestSwitchObservable from './src/TestSwitchObservable'
import TestSwitchObservableComplex from './src/TestSwitchObservableComplex'
import TestSwitchStatic from './src/TestSwitchStatic'
import TestSymbolFunction from './src/TestSymbolFunction'
import TestSymbolObservable from './src/TestSymbolObservable'
import TestSymbolRemoval from './src/TestSymbolRemoval'
import TestSymbolStatic from './src/TestSymbolStatic'
import TestTabIndexBooleanFunction from './src/TestTabIndexBooleanFunction'
import TestTabIndexBooleanObservable from './src/TestTabIndexBooleanObservable'
import TestTabIndexBooleanStatic from './src/TestTabIndexBooleanStatic'
import TestTemplateExternal from './src/TestTemplateExternal'
import TestTemplateSVG from './src/TestTemplateSVG'
import TestTernaryChildrenFunction from './src/TestTernaryChildrenFunction'
import TestTernaryChildrenObservableStatic from './src/TestTernaryChildrenObservableStatic'
import TestTernaryFunction from './src/TestTernaryFunction'
import TestTernaryObservable from './src/TestTernaryObservable'
import TestTernaryObservableChildren from './src/TestTernaryObservableChildren'
import TestTernaryStatic from './src/TestTernaryStatic'
import TestTernaryStaticInline from './src/TestTernaryStaticInline'
import TestUndefinedFunction from './src/TestUndefinedFunction'
import TestUndefinedObservable from './src/TestUndefinedObservable'
import TestUndefinedRemoval from './src/TestUndefinedRemoval'
import TestUndefinedStatic from './src/TestUndefinedStatic'
import TestCustomElementBasic from './src/TestCustomElementBasic'
import TestCustomElementSlots from './src/TestCustomElementSlots'
import TestCustomElementContext from './src/TestCustomElementContext'
import TestCustomElementNested from './src/TestCustomElementNested'
import TestCustomElementComprehensive from './src/TestCustomElementComprehensive'

globalThis.Woby = Woby

/* MAIN */

const tests = [
    // TestABCD,
    // TestAttributeBooleanStatic,
    // TestAttributeFunction,
    // TestAttributeFunctionBoolean,
    // TestAttributeObservable,
    // TestAttributeObservableBoolean,
    // TestAttributeRemoval,
    // TestAttributeStatic,
    // TestBigIntFunction,
    // TestBigIntObservable,

    // TestBigIntRemoval,
    // TestBigIntStatic,
    // TestBooleanFunction,
    // TestBooleanObservable,
    // TestBooleanRemoval,
    // TestBooleanStatic,
    // TestCheckboxIndeterminateToggle,
    // TestChildOverReexecution,
    // TestChildren,
    // TestChildrenBoolean,

    // TestChildrenSymbol,
    // TestClassesArrayCleanup,
    // TestClassesArrayFunction,
    // TestClassesArrayFunctionMultiple,
    // TestClassesArrayFunctionValue,
    // TestClassesArrayNestedStatic,
    // TestClassesArrayObservable,
    // TestClassesArrayObservableMultiple,
    // TestClassesArrayObservableValue,
    // TestClassesArrayRemoval,
    // TestClassesArrayRemovalMultiple,

    // TestClassesArrayStatic,
    // TestClassesArrayStaticMultiple,
    // TestClassesArrayStore,
    // TestClassesArrayStoreMultiple,
    // TestClassesObjectCleanup,
    // TestClassesObjectFunction,
    // TestClassesObjectFunctionMultiple,
    // TestClassesObjectObservable,
    // TestClassesObjectObservableMultiple,
    // TestClassesObjectRemoval,

    // TestClassesObjectRemovalMultiple,
    // TestClassesObjectStatic,
    // TestClassesObjectStaticMultiple,
    // TestClassesObjectStore,
    // TestClassesObjectStoreMultiple,
    // TestClassFunction,
    // TestClassFunctionString,
    // TestClassNameFunction,
    // TestClassNameObservable,
    // TestClassNameStatic,

    // TestClassObservable,
    // TestClassObservableString,
    // TestClassRemoval,
    // TestClassRemovalString,
    // TestClassStatic,
    // TestClassStaticString,
    // TestCleanupInner,
    // TestCleanupInnerPortal,
    // TestComponentFunction,
    // TestComponentObservable,

    // TestComponentObservableDirect,
    // TestComponentStatic,
    // TestComponentStaticProps,
    // TestComponentStaticRenderProps,
    // TestComponentStaticRenderState,
    // TestContextComponents,
    // TestContextHook,
    // TestDirective,
    // TestDirectiveRef,
    // TestDirectiveRegisterLocal,
    // TestDirectiveSingleArgument,

    // TestContextDynamicContext,
    // TestDynamicFunctionComponent,
    // TestDynamicFunctionProps,
    // TestDynamicHeading,
    // TestDynamicObservableChildren,
    // TestDynamicObservableComponent,
    // TestDynamicObservableProps,
    // TestDynamicStoreProps,

    // TestErrorBoundary,
    // TestErrorBoundaryNoError,
    // TestErrorBoundaryChildrenFunction,
    // TestErrorBoundaryChildrenObservableStatic,
    // TestErrorBoundaryFallbackFunction,
    // TestErrorBoundaryFallbackObservableStatic,

    // TestEventClickAndClickCaptureStatic,
    // TestEventClickCaptureObservable,
    // TestEventClickCaptureRemoval,
    // TestEventClickCaptureStatic,
    // TestEventClickObservable,
    // TestEventClickRemoval,
    // TestEventClickStatic,
    // TestEventClickStopImmediatePropagation,
    // TestEventClickStopPropagation,
    // TestEventEnterAndEnterCaptureStatic,
    // TestEventEnterStopImmediatePropagation,
    // TestEventEnterStopPropagation,
    // TestEventMiddleClickCaptureStatic,
    // TestEventMiddleClickStatic,
    // TestEventTargetCurrentTarget,

    // TestForFallbackFunction,
    // TestForFallbackObservable,
    // TestForFallbackObservableStatic,
    // TestForFallbackStatic,
    // TestForFunctionObservables,
    // TestForObservableObservables,
    // TestForObservables,
    // TestForObservablesStatic,
    // TestForRandom,
    // TestForRandomOnlyChild,
    // TestForStatic,

    // TestForUnkeyedFallbackFunction,
    // TestForUnkeyedFallbackObservable,
    // TestForUnkeyedFallbackObservableStatic,
    // TestForUnkeyedFallbackStatic,
    // TestForUnkeyedFunctionObservables,
    // TestForUnkeyedObservableObservables,
    // TestForUnkeyedObservables,
    // TestForUnkeyedObservablesStatic,
    // TestForUnkeyedRandom,
    // TestForUnkeyedRandomOnlyChild,
    // TestForUnkeyedStatic,

    // TestFragmentStatic,
    // TestFragmentStaticComponent,
    // TestFragmentStaticDeep,
    // TestHTMLDangerouslySetInnerHTMLFunction,
    // TestHTMLDangerouslySetInnerHTMLFunctionString,
    // TestHTMLDangerouslySetInnerHTMLObservable,
    // TestHTMLDangerouslySetInnerHTMLObservableString,
    // TestHTMLDangerouslySetInnerHTMLStatic,
    // // error TestHTMLFunctionStatic, // html template
    // // error TestHTMLFunctionStaticRegistry,

    // TestHTMLInnerHTMLFunction,
    // TestHTMLInnerHTMLObservable,
    // TestHTMLInnerHTMLStatic,
    // TestHTMLOuterHTMLFunction,
    // TestHTMLOuterHTMLObservable,
    // TestHTMLOuterHTMLStatic,
    // TestHTMLTextContentFunction,
    // TestHTMLTextContentObservable,
    // TestHTMLTextContentStatic,

    // TestIdFunction,
    // TestIdObservable,
    // TestIdRemoval,
    // TestIdStatic,
    // TestIfChildrenFunction,
    // TestIfChildrenFunctionObservable,
    // TestIfChildrenObservable,
    // TestIfChildrenObservableStatic,
    // TestIfFallbackFunction,
    // TestIfFallbackObservable,
    // TestIfFallbackObservableStatic,
    // TestIfFallbackStatic,
    // TestIfFunction,
    // TestIfFunctionUntracked,
    // TestIfFunctionUntrackedNarrowed,
    // TestIfFunctionUntrackedUnnarrowed,
    // TestIfNestedFunctionNarrowed,
    // TestIfNestedFunctionUnnarrowed,
    // TestIfObservable,
    // TestIfRace,
    // TestIfStatic,

    TestInputForm,
    TestInputLabelFor,
    TestLazy,
    // // error (IF) TestNestedArrays,
    // TestNestedIfs,
    // // error TestNestedIfsLazy,
    // TestNullFunction,
    // TestNullObservable,

    // TestNullRemoval,
    // TestNullStatic,
    // TestNumberFunction,
    // TestNumberObservable,
    // TestNumberRemoval,
    // TestNumberStatic,
    // TestPortalMountObservable,
    // TestPortalObservable,
    // TestPortalRemoval,
    // TestPortalStatic,

    // TestPortalWhenObservable,
    // TestPortalWrapperStatic,
    // TestProgressIndeterminateToggle,
    // TestPromiseRejected,
    // TestPromiseResolved,
    // TestPropertyCheckedFunction,
    // TestPropertyCheckedObservable,
    // TestPropertyCheckedRemoval,
    // TestPropertyCheckedStatic,
    // TestPropertyValueFunction,

    // TestPropertyValueObservable,
    // TestPropertyValueRemoval,
    // TestPropertyValueStatic,
    // TestRef,
    // TestRefContext,
    // TestRefs,
    // TestRefsNested,
    // TestRefUnmounting,
    // TestRefUntrack,
    // TestRenderToString,

    // TestRenderToStringNested,
    // TestRenderToStringSuspense,
    // TestRenderToStringSuspenseNested,
    // TestResourceFallbackLatest,
    // TestResourceFallbackValue,
    // TestSelectObservableOption,
    // TestSelectObservableValue,
    // TestSelectStaticOption,
    // TestSelectStaticValue,
    // TestSimpleExpect,

    // TestStringFunction,
    // TestStringObservable,
    // TestStringObservableDeepStatic,
    // TestStringObservableStatic,
    // TestStringRemoval,
    // TestStringStatic,
    // TestStyleFunction,
    // TestStyleFunctionNumeric,
    // TestStyleFunctionString,
    // TestStyleFunctionVariable,
    // TestStyleObservable,

    // TestStyleObservableNumeric,
    // TestStyleObservableString,
    // TestStyleObservableVariable,
    // TestStyleRemoval,
    // TestStylesCleanup,
    // TestStylesFunction,
    // TestStylesMixed,
    // TestStylesObservable,
    // TestStylesRemoval,
    // TestStylesStatic,
    // TestStylesStore,

    // TestStyleStatic,
    // TestStyleStaticNumeric,
    // TestStyleStaticString,
    // TestStyleStaticVariable,
    // TestSuspenseAlive,
    // TestSuspenseAlwaysLatest,
    // TestSuspenseAlwaysValue,
    // TestSuspenseChildrenFunction,
    // TestSuspenseChildrenObservableStatic,
    // TestSuspenseCleanup,
    // TestSuspenseFallbackFunction,

    // TestSuspenseFallbackObservableStatic,
    // TestSuspenseMiddleman,
    // TestSuspenseNever,
    // TestSuspenseNeverRead,
    // TestSuspenseObservable,
    // TestSuspenseWhen,
    // TestSVGAttributeRemoval,
    // TestSVGClassObject,
    // TestSVGClassString,
    // TestSVGFunction,
    // TestSVGObservable,
    // TestSVGStatic,

    // TestSVGStaticCamelCase,
    // TestSVGStaticComplex,
    // TestSVGStyleObject,
    // TestSVGStyleString,
    // TestSwitchCaseFunction,
    // TestSwitchCaseObservableStatic,
    // TestSwitchDefaultFunction,
    // TestSwitchDefaultObservableStatic,
    // TestSwitchFallbackFunction,
    // TestSwitchFallbackObservableStatic,
    // TestSwitchFunction,

    // TestSwitchObservable,
    // TestSwitchObservableComplex,
    // TestSwitchStatic,
    // TestSymbolFunction,
    // TestSymbolObservable,
    // TestSymbolRemoval,
    // TestSymbolStatic,
    // TestTabIndexBooleanFunction,
    // TestTabIndexBooleanObservable,
    // TestTabIndexBooleanStatic,
    // TestTemplateExternal,
    // TestTemplateSVG,

    // TestTernaryChildrenFunction,
    // TestTernaryChildrenObservableStatic,
    // TestTernaryFunction,
    // TestTernaryObservable,
    // TestTernaryObservableChildren,
    // TestTernaryStatic,
    // TestTernaryStaticInline,
    // TestUndefinedFunction,
    // TestUndefinedObservable,
    // TestUndefinedRemoval,
    // TestUndefinedStatic,

    //ignore for now api not ready
    // TestCustomElementBasic,
    // TestCustomElementSlots,
    // TestCustomElementContext,
    // TestCustomElementNested,
    // TestCustomElementComprehensive,

    // KIV Component
    // TestKeepAliveObservable,
    // TestKeepAliveStatic,

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