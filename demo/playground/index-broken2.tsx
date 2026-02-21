/* IMPORT */

import * as Woby from 'woby'
import type { JSX } from 'woby'
import { $ } from 'woby'

// Import all test components
import TestSimpleExpect from './src/TestSimpleExpect'
import TestNullStatic from './src/TestNullStatic'
import TestNullObservable from './src/TestNullObservable'
import TestNullFunction from './src/TestNullFunction'
import TestNullRemoval from './src/TestNullRemoval'
import TestUndefinedStatic from './src/TestUndefinedStatic'
import TestUndefinedObservable from './src/TestUndefinedObservable'
import TestUndefinedFunction from './src/TestUndefinedFunction'
import TestUndefinedRemoval from './src/TestUndefinedRemoval'
import TestBooleanStatic from './src/TestBooleanStatic'
import TestBooleanObservable from './src/TestBooleanObservable'
import TestBooleanFunction from './src/TestBooleanFunction'
import TestBooleanRemoval from './src/TestBooleanRemoval'
import TestSymbolStatic from './src/TestSymbolStatic'
import TestSymbolObservable from './src/TestSymbolObservable'
import TestSymbolFunction from './src/TestSymbolFunction'
import TestSymbolRemoval from './src/TestSymbolRemoval'
import TestNumberStatic from './src/TestNumberStatic'
import TestNumberObservable from './src/TestNumberObservable'
import TestNumberFunction from './src/TestNumberFunction'
import TestNumberRemoval from './src/TestNumberRemoval'
import TestBigIntStatic from './src/TestBigIntStatic'
import TestBigIntObservable from './src/TestBigIntObservable'
import TestBigIntFunction from './src/TestBigIntFunction'
import TestBigIntRemoval from './src/TestBigIntRemoval'
import TestStringStatic from './src/TestStringStatic'
import TestStringObservable from './src/TestStringObservable'
import TestStringObservableStatic from './src/TestStringObservableStatic'
import TestStringObservableDeepStatic from './src/TestStringObservableDeepStatic'
import TestStringFunction from './src/TestStringFunction'
import TestStringRemoval from './src/TestStringRemoval'
import TestAttributeStatic from './src/TestAttributeStatic'
import TestAttributeObservable from './src/TestAttributeObservable'
import TestAttributeObservableBoolean from './src/TestAttributeObservableBoolean'
import TestAttributeFunction from './src/TestAttributeFunction'
import TestAttributeFunctionBoolean from './src/TestAttributeFunctionBoolean'
import TestAttributeRemoval from './src/TestAttributeRemoval'
import TestAttributeBooleanStatic from './src/TestAttributeBooleanStatic'
import TestPropertyCheckedStatic from './src/TestPropertyCheckedStatic'
import TestPropertyCheckedObservable from './src/TestPropertyCheckedObservable'
import TestPropertyCheckedFunction from './src/TestPropertyCheckedFunction'
import TestPropertyCheckedRemoval from './src/TestPropertyCheckedRemoval'
import TestPropertyValueStatic from './src/TestPropertyValueStatic'
import TestPropertyValueObservable from './src/TestPropertyValueObservable'
import TestPropertyValueFunction from './src/TestPropertyValueFunction'
import TestPropertyValueRemoval from './src/TestPropertyValueRemoval'
import TestInputLabelFor from './src/TestInputLabelFor'
import TestInputForm from './src/TestInputForm'
import TestCheckboxIndeterminateToggle from './src/TestCheckboxIndeterminateToggle'
import TestProgressIndeterminateToggle from './src/TestProgressIndeterminateToggle'
import TestSelectStaticOption from './src/TestSelectStaticOption'
import TestSelectStaticValue from './src/TestSelectStaticValue'
import TestSelectObservableOption from './src/TestSelectObservableOption'
import TestSelectObservableValue from './src/TestSelectObservableValue'
import TestIdStatic from './src/TestIdStatic'
import TestIdObservable from './src/TestIdObservable'
import TestIdFunction from './src/TestIdFunction'
import TestIdRemoval from './src/TestIdRemoval'
import TestClassNameStatic from './src/TestClassNameStatic'
import TestClassNameObservable from './src/TestClassNameObservable'
import TestClassNameFunction from './src/TestClassNameFunction'
import TestClassStatic from './src/TestClassStatic'
import TestClassStaticString from './src/TestClassStaticString'
import TestClassObservable from './src/TestClassObservable'
import TestClassObservableString from './src/TestClassObservableString'
import TestClassFunction from './src/TestClassFunction'
import TestClassFunctionString from './src/TestClassFunctionString'
import TestClassRemoval from './src/TestClassRemoval'
import TestClassRemovalString from './src/TestClassRemovalString'
import TestClassesArrayStatic from './src/TestClassesArrayStatic'
import TestClassesArrayStaticMultiple from './src/TestClassesArrayStaticMultiple'
import TestClassesArrayObservable from './src/TestClassesArrayObservable'
import TestClassesArrayObservableMultiple from './src/TestClassesArrayObservableMultiple'
import TestClassesArrayObservableValue from './src/TestClassesArrayObservableValue'
import TestClassesArrayFunction from './src/TestClassesArrayFunction'
import TestClassesArrayFunctionMultiple from './src/TestClassesArrayFunctionMultiple'
import TestClassesArrayFunctionValue from './src/TestClassesArrayFunctionValue'
import TestClassesArrayStore from './src/TestClassesArrayStore'
import TestClassesArrayStoreMultiple from './src/TestClassesArrayStoreMultiple'
import TestClassesArrayNestedStatic from './src/TestClassesArrayNestedStatic'
import TestClassesArrayRemoval from './src/TestClassesArrayRemoval'
import TestClassesArrayRemovalMultiple from './src/TestClassesArrayRemovalMultiple'
import TestClassesArrayCleanup from './src/TestClassesArrayCleanup'
import TestClassesObjectStatic from './src/TestClassesObjectStatic'
import TestClassesObjectStaticMultiple from './src/TestClassesObjectStaticMultiple'
import TestClassesObjectObservable from './src/TestClassesObjectObservable'
import TestClassesObjectObservableMultiple from './src/TestClassesObjectObservableMultiple'
import TestClassesObjectFunction from './src/TestClassesObjectFunction'
import TestClassesObjectFunctionMultiple from './src/TestClassesObjectFunctionMultiple'
import TestClassesObjectStore from './src/TestClassesObjectStore'
import TestClassesObjectStoreMultiple from './src/TestClassesObjectStoreMultiple'
import TestClassesObjectRemoval from './src/TestClassesObjectRemoval'
import TestStyleStatic from './src/TestStyleStatic'
import TestStyleStaticString from './src/TestStyleStaticString'
import TestStyleStaticNumeric from './src/TestStyleStaticNumeric'
import TestStyleStaticVariable from './src/TestStyleStaticVariable'
import TestStyleObservable from './src/TestStyleObservable'
import TestStyleObservableString from './src/TestStyleObservableString'
import TestStyleObservableNumeric from './src/TestStyleObservableNumeric'
import TestStyleObservableVariable from './src/TestStyleObservableVariable'
import TestStyleFunction from './src/TestStyleFunction'
import TestStyleFunctionString from './src/TestStyleFunctionString'
import TestStyleFunctionNumeric from './src/TestStyleFunctionNumeric'
import TestStyleFunctionVariable from './src/TestStyleFunctionVariable'
import TestStyleRemoval from './src/TestStyleRemoval'
// import TestEventClickStatic from './src/TestEventClickStatic' // File does not exist
// import TestEventClickCaptureStatic from './src/TestEventClickCaptureStatic' // File does not exist
// import TestEventClickObservable from './src/TestEventClickObservable' // File does not exist
// import TestEventClickCaptureObservable from './src/TestEventClickCaptureObservable' // File does not exist
// import TestEventClickFunction from './src/TestEventClickFunction' // File does not exist
// import TestEventClickCaptureFunction from './src/TestEventClickCaptureFunction' // File does not exist
// import TestEventClickRemoval from './src/TestEventClickRemoval' // File does not exist
import TestEventClickCaptureRemoval from './src/TestEventClickCaptureRemoval'
import TestEventClickOnce from './src/TestEventClickOnce'
import TestEventClickOnceCapture from './src/TestEventClickOnceCapture'
import TestEventClickPassive from './src/TestEventClickPassive'
import TestEventClickPassiveCapture from './src/TestEventClickPassiveCapture'
import TestEventClickPreventDefault from './src/TestEventClickPreventDefault'
import TestEventClickPreventDefaultCapture from './src/TestEventClickPreventDefaultCapture'
import TestEventClickStopPropagation from './src/TestEventClickStopPropagation'
import TestEventClickStopPropagationCapture from './src/TestEventClickStopPropagationCapture'
import TestEventClickStopImmediatePropagation from './src/TestEventClickStopImmediatePropagation'
import TestEventClickStopImmediatePropagationCapture from './src/TestEventClickStopImmediatePropagationCapture'
import TestEventClickAndClickCaptureStatic from './src/TestEventClickAndClickCaptureStatic'
import TestEventDoubleClickStatic from './src/TestEventDoubleClickStatic'
import TestEventDoubleClickCaptureStatic from './src/TestEventDoubleClickCaptureStatic'
import TestEventEnterStatic from './src/TestEventEnterStatic'
import TestEventEnterCaptureStatic from './src/TestEventEnterCaptureStatic'
import TestEventEnterObservable from './src/TestEventEnterObservable'
import TestEventEnterCaptureObservable from './src/TestEventEnterCaptureObservable'
// import TestEventEnterFunction from './src/TestEventEnterFunction' // File does not exist
// import TestEventEnterCaptureFunction from './src/TestEventEnterCaptureFunction' // File does not exist
import TestEventEnterRemoval from './src/TestEventEnterRemoval'
import TestEventEnterCaptureRemoval from './src/TestEventEnterCaptureRemoval'
import TestEventEnterOnce from './src/TestEventEnterOnce'
import TestEventEnterOnceCapture from './src/TestEventEnterOnceCapture'
import TestEventEnterPassive from './src/TestEventEnterPassive'
import TestEventEnterPassiveCapture from './src/TestEventEnterPassiveCapture'
import TestEventEnterPreventDefault from './src/TestEventEnterPreventDefault'
import TestEventEnterPreventDefaultCapture from './src/TestEventEnterPreventDefaultCapture'
import TestEventEnterStopPropagation from './src/TestEventEnterStopPropagation'
import TestEventEnterStopPropagationCapture from './src/TestEventEnterStopPropagationCapture'
import TestEventEnterStopImmediatePropagation from './src/TestEventEnterStopImmediatePropagation'
import TestEventEnterStopImmediatePropagationCapture from './src/TestEventEnterStopImmediatePropagationCapture'
import TestEventEnterAndEnterCaptureStatic from './src/TestEventEnterAndEnterCaptureStatic'
import TestEventMiddleClickStatic from './src/TestEventMiddleClickStatic'
import TestEventMiddleClickCaptureStatic from './src/TestEventMiddleClickCaptureStatic'
import TestEventTargetCurrentTarget from './src/TestEventTargetCurrentTarget'
import TestABCD from './src/TestABCD'
import TestChildrenBoolean from './src/TestChildrenBoolean'
import TestChildrenSymbol from './src/TestChildrenSymbol'
import TestChildOverReexecution from './src/TestChildOverReexecution'
import TestCleanupInner from './src/TestCleanupInner'
import TestCleanupInnerPortal from './src/TestCleanupInnerPortal'
import TestContextDynamicContext from './src/TestContextDynamicContext'
import TestDynamicHeading from './src/TestDynamicHeading'
import TestDynamicObservableComponent from './src/TestDynamicObservableComponent'
import TestDynamicFunctionComponent from './src/TestDynamicFunctionComponent'
import TestDynamicObservableProps from './src/TestDynamicObservableProps'
import TestDynamicFunctionProps from './src/TestDynamicFunctionProps'
import TestDynamicObservableChildren from './src/TestDynamicObservableChildren'
import TestDynamicStoreProps from './src/TestDynamicStoreProps'
import TestIfStatic from './src/TestIfStatic'
import TestIfObservable from './src/TestIfObservable'
import TestIfFunction from './src/TestIfFunction'
import TestIfFunctionUntracked from './src/TestIfFunctionUntracked'
import TestIfFunctionUntrackedUnnarrowed from './src/TestIfFunctionUntrackedUnnarrowed'
import TestIfFunctionUntrackedNarrowed from './src/TestIfFunctionUntrackedNarrowed'
import TestIfNestedFunctionUnnarrowed from './src/TestIfNestedFunctionUnnarrowed'
import TestIfNestedFunctionNarrowed from './src/TestIfNestedFunctionNarrowed'
import TestIfChildrenObservable from './src/TestIfChildrenObservable'
import TestIfChildrenObservableStatic from './src/TestIfChildrenObservableStatic'
import TestIfChildrenFunction from './src/TestIfChildrenFunction'
import TestIfChildrenFunctionObservable from './src/TestIfChildrenFunctionObservable'
import TestIfFallbackStatic from './src/TestIfFallbackStatic'
import TestIfFallbackObservable from './src/TestIfFallbackObservable'
import TestIfFallbackObservableStatic from './src/TestIfFallbackObservableStatic'
import TestIfFallbackFunction from './src/TestIfFallbackFunction'
import TestIfRace from './src/TestIfRace'
import TestKeepAliveStatic from './src/TestKeepAliveStatic'
import TestKeepAliveObservable from './src/TestKeepAliveObservable'
import TestTernaryStatic from './src/TestTernaryStatic'
import TestTernaryStaticInline from './src/TestTernaryStaticInline'
import TestTernaryObservable from './src/TestTernaryObservable'
import TestTernaryObservableChildren from './src/TestTernaryObservableChildren'
import TestTernaryFunction from './src/TestTernaryFunction'
import TestTernaryChildrenObservableStatic from './src/TestTernaryChildrenObservableStatic'
import TestTernaryChildrenFunction from './src/TestTernaryChildrenFunction'
import TestSwitchStatic from './src/TestSwitchStatic'
import TestSwitchObservable from './src/TestSwitchObservable'
import TestSwitchObservableComplex from './src/TestSwitchObservableComplex'
import TestSwitchFunction from './src/TestSwitchFunction'
import TestSwitchCaseObservableStatic from './src/TestSwitchCaseObservableStatic'
import TestSwitchCaseFunction from './src/TestSwitchCaseFunction'
import TestSwitchDefaultObservableStatic from './src/TestSwitchDefaultObservableStatic'
import TestSwitchDefaultFunction from './src/TestSwitchDefaultFunction'
import TestSwitchFallbackObservableStatic from './src/TestSwitchFallbackObservableStatic'
import TestSwitchFallbackFunction from './src/TestSwitchFallbackFunction'
import TestComponentStatic from './src/TestComponentStatic'
import TestComponentStaticProps from './src/TestComponentStaticProps'
import TestComponentStaticRenderProps from './src/TestComponentStaticRenderProps'
import TestComponentStaticRenderState from './src/TestComponentStaticRenderState'
import TestComponentObservableDirect from './src/TestComponentObservableDirect'
import TestComponentObservable from './src/TestComponentObservable'
import TestComponentFunction from './src/TestComponentFunction'
import TestTabIndexBooleanStatic from './src/TestTabIndexBooleanStatic'
import TestTabIndexBooleanObservable from './src/TestTabIndexBooleanObservable'
import TestTabIndexBooleanFunction from './src/TestTabIndexBooleanFunction'
import TestForStatic from './src/TestForStatic'
import TestForObservables from './src/TestForObservables'
import TestForObservablesStatic from './src/TestForObservablesStatic'
import TestForObservableObservables from './src/TestForObservableObservables'
import TestForFunctionObservables from './src/TestForFunctionObservables'
import TestForRandom from './src/TestForRandom'
import TestForRandomOnlyChild from './src/TestForRandomOnlyChild'
import TestForFallbackStatic from './src/TestForFallbackStatic'
import TestForFallbackObservable from './src/TestForFallbackObservable'
import TestForFallbackObservableStatic from './src/TestForFallbackObservableStatic'
import TestForFallbackFunction from './src/TestForFallbackFunction'
import TestForUnkeyedStatic from './src/TestForUnkeyedStatic'
import TestForUnkeyedObservables from './src/TestForUnkeyedObservables'
import TestForUnkeyedObservablesStatic from './src/TestForUnkeyedObservablesStatic'
import TestForUnkeyedObservableObservables from './src/TestForUnkeyedObservableObservables'
import TestForUnkeyedFunctionObservables from './src/TestForUnkeyedFunctionObservables'
import TestForUnkeyedRandom from './src/TestForUnkeyedRandom'
import TestForUnkeyedRandomOnlyChild from './src/TestForUnkeyedRandomOnlyChild'
import TestForUnkeyedFallbackStatic from './src/TestForUnkeyedFallbackStatic'
import TestForUnkeyedFallbackObservable from './src/TestForUnkeyedFallbackObservable'
import TestForUnkeyedFallbackObservableStatic from './src/TestForUnkeyedFallbackObservableStatic'
import TestForUnkeyedFallbackFunction from './src/TestForUnkeyedFallbackFunction'
import TestFragmentStatic from './src/TestFragmentStatic'
import TestFragmentStaticComponent from './src/TestFragmentStaticComponent'
import TestFragmentStaticDeep from './src/TestFragmentStaticDeep'
import TestErrorBoundary from './src/TestErrorBoundary'
import TestErrorBoundaryChildrenObservableStatic from './src/TestErrorBoundaryChildrenObservableStatic'
import TestErrorBoundaryChildrenFunction from './src/TestErrorBoundaryChildrenFunction'
import TestErrorBoundaryFallbackObservableStatic from './src/TestErrorBoundaryFallbackObservableStatic'
import TestErrorBoundaryFallbackFunction from './src/TestErrorBoundaryFallbackFunction'
import TestChildren from './src/TestChildren'
import TestRef from './src/TestRef'
import TestRefs from './src/TestRefs'
import TestRefsNested from './src/TestRefsNested'
import TestRefUnmounting from './src/TestRefUnmounting'
import TestRefContext from './src/TestRefContext'
import TestRefUntrack from './src/TestRefUntrack'
import TestPromiseResolved from './src/TestPromiseResolved'
import TestPromiseRejected from './src/TestPromiseRejected'
import TestSVGStatic from './src/TestSVGStatic'
import TestSVGStaticComplex from './src/TestSVGStaticComplex'
import TestSVGStaticCamelCase from './src/TestSVGStaticCamelCase'
import TestSVGObservable from './src/TestSVGObservable'
import TestSVGFunction from './src/TestSVGFunction'
import TestSVGStyleObject from './src/TestSVGStyleObject'
import TestSVGStyleString from './src/TestSVGStyleString'
import TestSVGClassObject from './src/TestSVGClassObject'
import TestSVGClassString from './src/TestSVGClassString'
import TestSVGAttributeRemoval from './src/TestSVGAttributeRemoval'
import TestTemplateExternal from './src/TestTemplateExternal'
import TestTemplateSVG from './src/TestTemplateSVG'
import TestContextComponents from './src/TestContextComponents'
import TestContextHook from './src/TestContextHook'
import TestRenderToString from './src/TestRenderToString'
import TestRenderToStringNested from './src/TestRenderToStringNested'
import TestRenderToStringSuspense from './src/TestRenderToStringSuspense'
import TestRenderToStringSuspenseNested from './src/TestRenderToStringSuspenseNested'
import TestPortalStatic from './src/TestPortalStatic'
import TestPortalObservable from './src/TestPortalObservable'
import TestPortalRemoval from './src/TestPortalRemoval'
import TestPortalMountObservable from './src/TestPortalMountObservable'
import TestPortalWhenObservable from './src/TestPortalWhenObservable'
import TestPortalWrapperStatic from './src/TestPortalWrapperStatic'
import TestResourceFallbackValue from './src/TestResourceFallbackValue'
import TestResourceFallbackLatest from './src/TestResourceFallbackLatest'
import TestSuspenseAlwaysValue from './src/TestSuspenseAlwaysValue'
import TestSuspenseAlwaysLatest from './src/TestSuspenseAlwaysLatest'
import TestSuspenseNever from './src/TestSuspenseNever'
import TestSuspenseNeverRead from './src/TestSuspenseNeverRead'
import TestSuspenseMiddleman from './src/TestSuspenseMiddleman'
import TestSuspenseObservable from './src/TestSuspenseObservable'
import TestSuspenseWhen from './src/TestSuspenseWhen'
import TestSuspenseAlive from './src/TestSuspenseAlive'
import TestSuspenseChildrenObservableStatic from './src/TestSuspenseChildrenObservableStatic'
import TestSuspenseChildrenFunction from './src/TestSuspenseChildrenFunction'
import TestSuspenseFallbackObservableStatic from './src/TestSuspenseFallbackObservableStatic'
import TestSuspenseFallbackFunction from './src/TestSuspenseFallbackFunction'
import TestSuspenseCleanup from './src/TestSuspenseCleanup'
import TestLazy from './src/TestLazy'
import TestNestedArrays from './src/TestNestedArrays'
import TestNestedIfs from './src/TestNestedIfs'
import TestNestedIfsLazy from './src/TestNestedIfsLazy'
import TestHMRFor from './src/TestHMRFor'

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
    TestSymbolStatic,
    TestSymbolObservable,
    TestSymbolFunction,
    TestSymbolRemoval,
    TestNumberStatic,
    TestNumberObservable,
    TestNumberFunction,
    TestNumberRemoval,
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
    TestPropertyCheckedStatic,
    TestPropertyCheckedObservable,
    TestPropertyCheckedFunction,
    TestPropertyCheckedRemoval,
    TestPropertyValueStatic,
    TestPropertyValueObservable,
    TestPropertyValueFunction,
    TestPropertyValueRemoval,
    TestInputLabelFor,
    TestInputForm,
    TestCheckboxIndeterminateToggle,
    TestProgressIndeterminateToggle,
    TestSelectStaticOption,
    TestSelectStaticValue,
    TestSelectObservableOption,
    TestSelectObservableValue,
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
    TestClassesArrayStatic,
    TestClassesArrayStaticMultiple,
    TestClassesArrayObservable,
    TestClassesArrayObservableMultiple,
    TestClassesArrayObservableValue,
    TestClassesArrayFunction,
    TestClassesArrayFunctionMultiple,
    TestClassesArrayFunctionValue,
    TestClassesArrayStore,
    TestClassesArrayStoreMultiple,
    TestClassesArrayNestedStatic,
    TestClassesArrayRemoval,
    TestClassesArrayRemovalMultiple,
    TestClassesArrayCleanup,
    TestClassesObjectStatic,
    TestClassesObjectStaticMultiple,
    TestClassesObjectObservable,
    TestClassesObjectObservableMultiple,
    TestClassesObjectFunction,
    TestClassesObjectFunctionMultiple,
    TestClassesObjectStore,
    TestClassesObjectStoreMultiple,
    TestClassesObjectRemoval,
    TestStyleStatic,
    TestStyleStaticString,
    TestStyleStaticNumeric,
    TestStyleStaticVariable,
    TestStyleObservable,
    TestStyleObservableString,
    TestStyleObservableNumeric,
    TestStyleObservableVariable,
    TestStyleFunction,
    TestStyleFunctionString,
    TestStyleFunctionNumeric,
    TestStyleFunctionVariable,
    TestStyleRemoval,
    TestEventClickStatic,
    TestEventClickCaptureStatic,
    TestEventClickObservable,
    TestEventClickCaptureObservable,
    // TestEventClickFunction, // File does not exist
    TestEventClickCaptureFunction,
    TestEventClickRemoval,
    TestEventClickCaptureRemoval,
    TestEventClickOnce,
    TestEventClickOnceCapture,
    TestEventClickPassive,
    TestEventClickPassiveCapture,
    TestEventClickPreventDefault,
    TestEventClickPreventDefaultCapture,
    TestEventClickStopPropagation,
    TestEventClickStopPropagationCapture,
    TestEventClickStopImmediatePropagation,
    TestEventClickStopImmediatePropagationCapture,
    TestEventClickAndClickCaptureStatic,
    TestEventDoubleClickStatic,
    TestEventDoubleClickCaptureStatic,
    TestEventEnterStatic,
    TestEventEnterCaptureStatic,
    TestEventEnterObservable,
    TestEventEnterCaptureObservable,
    TestEventEnterFunction,
    TestEventEnterCaptureFunction,
    TestEventEnterRemoval,
    TestEventEnterCaptureRemoval,
    TestEventEnterOnce,
    TestEventEnterOnceCapture,
    TestEventEnterPassive,
    TestEventEnterPassiveCapture,
    TestEventEnterPreventDefault,
    TestEventEnterPreventDefaultCapture,
    TestEventEnterStopPropagation,
    TestEventEnterStopPropagationCapture,
    TestEventEnterStopImmediatePropagation,
    TestEventEnterStopImmediatePropagationCapture,
    TestEventEnterAndEnterCaptureStatic,
    TestEventMiddleClickStatic,
    TestEventMiddleClickCaptureStatic,
    TestEventTargetCurrentTarget,
    TestABCD,
    TestChildrenBoolean,
    TestChildrenSymbol,
    TestChildOverReexecution,
    TestCleanupInner,
    TestCleanupInnerPortal,
    TestContextDynamicContext,
    TestDynamicHeading,
    TestDynamicObservableComponent,
    TestDynamicFunctionComponent,
    TestDynamicObservableProps,
    TestDynamicFunctionProps,
    TestDynamicObservableChildren,
    TestDynamicStoreProps,
    TestIfStatic,
    TestIfObservable,
    TestIfFunction,
    TestIfFunctionUntracked,
    TestIfFunctionUntrackedUnnarrowed,
    TestIfFunctionUntrackedNarrowed,
    TestIfNestedFunctionUnnarrowed,
    TestIfNestedFunctionNarrowed,
    TestIfChildrenObservable,
    TestIfChildrenObservableStatic,
    TestIfChildrenFunction,
    TestIfChildrenFunctionObservable,
    TestIfFallbackStatic,
    TestIfFallbackObservable,
    TestIfFallbackObservableStatic,
    TestIfFallbackFunction,
    TestIfRace,
    TestKeepAliveStatic,
    TestKeepAliveObservable,
    TestTernaryStatic,
    TestTernaryStaticInline,
    TestTernaryObservable,
    TestTernaryObservableChildren,
    TestTernaryFunction,
    TestTernaryChildrenObservableStatic,
    TestTernaryChildrenFunction,
    TestSwitchStatic,
    TestSwitchObservable,
    TestSwitchObservableComplex,
    TestSwitchFunction,
    TestSwitchCaseObservableStatic,
    TestSwitchCaseFunction,
    TestSwitchDefaultObservableStatic,
    TestSwitchDefaultFunction,
    TestSwitchFallbackObservableStatic,
    TestSwitchFallbackFunction,
    TestComponentStatic,
    TestComponentStaticProps,
    TestComponentStaticRenderProps,
    TestComponentStaticRenderState,
    TestComponentObservableDirect,
    TestComponentObservable,
    TestComponentFunction,
    TestTabIndexBooleanStatic,
    TestTabIndexBooleanObservable,
    TestTabIndexBooleanFunction,
    TestForStatic,
    TestForObservables,
    TestForObservablesStatic,
    TestForObservableObservables,
    TestForFunctionObservables,
    TestForRandom,
    TestForRandomOnlyChild,
    TestForFallbackStatic,
    TestForFallbackObservable,
    TestForFallbackObservableStatic,
    TestForFallbackFunction,
    TestForUnkeyedStatic,
    TestForUnkeyedObservables,
    TestForUnkeyedObservablesStatic,
    TestForUnkeyedObservableObservables,
    TestForUnkeyedFunctionObservables,
    TestForUnkeyedRandom,
    TestForUnkeyedRandomOnlyChild,
    TestForUnkeyedFallbackStatic,
    TestForUnkeyedFallbackObservable,
    TestForUnkeyedFallbackObservableStatic,
    TestForUnkeyedFallbackFunction,
    TestFragmentStatic,
    TestFragmentStaticComponent,
    TestFragmentStaticDeep,
    TestErrorBoundary,
    TestErrorBoundaryChildrenObservableStatic,
    TestErrorBoundaryChildrenFunction,
    TestErrorBoundaryFallbackObservableStatic,
    TestErrorBoundaryFallbackFunction,
    TestChildren,
    TestRef,
    TestRefs,
    TestRefsNested,
    TestRefUnmounting,
    TestRefContext,
    TestRefUntrack,
    TestPromiseResolved,
    TestPromiseRejected,
    TestSVGStatic,
    TestSVGStaticComplex,
    TestSVGStaticCamelCase,
    TestSVGObservable,
    TestSVGFunction,
    TestSVGStyleObject,
    TestSVGStyleString,
    TestSVGClassObject,
    TestSVGClassString,
    TestSVGAttributeRemoval,
    TestTemplateExternal,
    TestTemplateSVG,
    TestContextComponents,
    TestContextHook,
    TestRenderToString,
    TestRenderToStringNested,
    TestRenderToStringSuspense,
    TestRenderToStringSuspenseNested,
    TestPortalStatic,
    TestPortalObservable,
    TestPortalRemoval,
    TestPortalMountObservable,
    TestPortalWhenObservable,
    TestPortalWrapperStatic,
    TestResourceFallbackValue,
    TestResourceFallbackLatest,
    TestSuspenseAlwaysValue,
    TestSuspenseAlwaysLatest,
    TestSuspenseNever,
    TestSuspenseNeverRead,
    TestSuspenseMiddleman,
    TestSuspenseObservable,
    TestSuspenseWhen,
    TestSuspenseAlive,
    TestSuspenseChildrenObservableStatic,
    TestSuspenseChildrenFunction,
    TestSuspenseFallbackObservableStatic,
    TestSuspenseFallbackFunction,
    TestSuspenseCleanup,
    TestLazy,
    TestNestedArrays,
    TestNestedIfs,
    TestNestedIfsLazy,
    TestHMRFor
]

export default () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {tests.map((TestComponent, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "10px" }}>
                <TestComponent />
            </div>
        ))}
    </div>
)

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
            render(<Test />, appElement)
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