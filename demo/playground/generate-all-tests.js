import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// List of all remaining test files to convert
const testFiles = [
    'TestUndefinedRemoval.tsx',
    'TestUndefinedObservable.tsx',
    'TestUndefinedFunction.tsx',
    'TestTernaryStaticInline.tsx',
    'TestTernaryStatic.tsx',
    'TestTernaryObservableChildren.tsx',
    'TestTernaryObservable.tsx',
    'TestTernaryFunction.tsx',
    'TestTernaryChildrenObservableStatic.tsx',
    'TestTernaryChildrenFunction.tsx',
    'TestTemplateSVG.tsx',
    'TestTemplateExternal.tsx',
    'TestTabIndexBooleanStatic.tsx',
    'TestTabIndexBooleanObservable.tsx',
    'TestTabIndexBooleanFunction.tsx',
    'TestSymbolStatic.tsx',
    'TestSymbolRemoval.tsx',
    'TestSymbolObservable.tsx',
    'TestSymbolFunction.tsx',
    'TestSwitchStatic.tsx',
    'TestSwitchObservableComplex.tsx',
    'TestSwitchObservable.tsx',
    'TestSwitchFunction.tsx',
    'TestSwitchFallbackObservableStatic.tsx',
    'TestSwitchFallbackFunction.tsx',
    'TestSwitchDefaultObservableStatic.tsx',
    'TestSwitchDefaultFunction.tsx',
    'TestSwitchCaseObservableStatic.tsx',
    'TestSwitchCaseFunction.tsx',
    'TestSVGStyleString.tsx',
    'TestSVGStyleObject.tsx',
    'TestSVGStaticComplex.tsx',
    'TestSVGStaticCamelCase.tsx',
    'TestSVGStatic.tsx',
    'TestSVGObservable.tsx',
    'TestSVGClassString.tsx',
    'TestSVGClassObject.tsx',
    'TestSVGAttributeRemoval.tsx',
    'TestSuspenseWhen.tsx',
    'TestSuspenseObservable.tsx',
    'TestSuspenseNeverRead.tsx',
    'TestSuspenseNever.tsx',
    'TestSuspenseMiddleman.tsx',
    'TestSuspenseFallbackObservableStatic.tsx',
    'TestSuspenseFallbackFunction.tsx',
    'TestSuspenseCleanup.tsx',
    'TestSuspenseChildrenObservableStatic.tsx',
    'TestSuspenseChildrenFunction.tsx',
    'TestSVGFunction.tsx',
    'TestSuspenseAlwaysValue.tsx',
    'TestSuspenseAlwaysLatest.tsx',
    'TestSuspenseAlive.tsx',
    'TestStyleStaticVariable.tsx',
    'TestStyleStaticString.tsx',
    'TestStyleStaticNumeric.tsx',
    'TestStyleStatic.tsx', // Already exists
    'TestStylesStore.tsx',
    'TestStylesStatic.tsx',
    'TestStylesRemoval.tsx',
    'TestStylesObservable.tsx',
    'TestStylesMixed.tsx',
    'TestStylesFunction.tsx',
    'TestHMRFor.tsx',
    'TestStylesCleanup.tsx',
    'TestStyleRemoval.tsx',
    'TestStyleObservableVariable.tsx',
    'TestStyleObservableString.tsx',
    'TestStyleObservableNumeric.tsx',
    'TestStyleObservable.tsx',
    'TestStyleFunctionVariable.tsx',
    'TestStyleFunctionString.tsx',
    'TestStyleFunctionNumeric.tsx',
    'TestStyleFunction.tsx',
    'TestStringStatic.tsx', // Already exists
    'TestStringRemoval.tsx',
    'TestStringObservableStatic.tsx',
    'TestStringObservableDeepStatic.tsx',
    'TestStringObservable.tsx', // Already exists
    'TestStringFunction.tsx',
    'TestSimpleExpect.tsx',
    'TestSelectStaticValue.tsx',
    'TestSelectStaticOption.tsx',
    'TestSelectObservableValue.tsx',
    'TestSelectObservableOption.tsx',
    'TestResourceFallbackValue.tsx',
    'TestResourceFallbackLatest.tsx',
    'TestRenderToStringSuspenseNested.tsx',
    'TestRenderToStringSuspense.tsx',
    'TestRenderToStringNested.tsx',
    'TestRenderToString.tsx',
    'TestRefUntrack.tsx',
    'TestRefUnmounting.tsx',
    'TestRefsNested.tsx',
    'TestRefs.tsx',
    'TestRefContext.tsx',
    'TestRef.tsx',
    'TestPropertyValueStatic.tsx',
    'TestPropertyValueRemoval.tsx',
    'TestPropertyValueObservable.tsx',
    'TestPropertyValueFunction.tsx',
    'TestPropertyCheckedStatic.tsx',
    'TestPropertyCheckedRemoval.tsx',
    'TestPropertyCheckedObservable.tsx',
    'TestPropertyCheckedFunction.tsx',
    'TestPromiseResolved.tsx',
    'TestPromiseRejected.tsx',
    'TestProgressIndeterminateToggle.tsx',
    'TestPortalWrapperStatic.tsx',
    'TestPortalWhenObservable.tsx',
    'TestPortalStatic.tsx',
    'TestPortalRemoval.tsx',
    'TestPortalObservable.tsx',
    'TestPortalMountObservable.tsx',
    'TestNumberStatic.tsx', // Already exists
    'TestNumberRemoval.tsx',
    'TestNumberObservable.tsx', // Already exists
    'TestNumberFunction.tsx',
    'TestNullStatic.tsx',
    'TestNullRemoval.tsx',
    'TestNullObservable.tsx',
    'TestNullFunction.tsx',
    'TestNestedIfsLazy.tsx',
    'TestNestedIfs.tsx',
    'TestNestedArrays.tsx',
    'TestLazy.tsx',
    'TestKeepAliveStatic.tsx',
    'TestKeepAliveObservable.tsx',
    'TestInputLabelFor.tsx',
    'TestInputForm.tsx',
    'TestIfStatic.tsx',
    'TestIfRace.tsx',
    'TestIfObservable.tsx',
    'TestIfNestedFunctionUnnarrowed.tsx',
    'TestIfNestedFunctionNarrowed.tsx',
    'TestIfFunctionUntrackedUnnarrowed.tsx',
    'TestIfFunctionUntrackedNarrowed.tsx',
    'TestIfFunctionUntracked.tsx',
    'TestIfFunction.tsx',
    'TestIfFallbackStatic.tsx',
    'TestIfFallbackObservableStatic.tsx',
    'TestIfFallbackObservable.tsx',
    'TestIfFallbackFunction.tsx',
    'TestIfChildrenObservableStatic.tsx',
    'TestIfChildrenObservable.tsx',
    'TestIfChildrenFunctionObservable.tsx',
    'TestIfChildrenFunction.tsx',
    'TestIdStatic.tsx',
    'TestIdRemoval.tsx',
    'TestIdObservable.tsx',
    'TestIdFunction.tsx',
    'TestErrorBoundaryFallbackObservableStatic.tsx',
    'TestErrorBoundaryFallbackFunction.tsx',
    'TestErrorBoundaryChildrenObservableStatic.tsx',
    'TestErrorBoundaryChildrenFunction.tsx',
    'TestErrorBoundary.tsx',
    'TestDynamicFunctionComponent.tsx',
    'TestDynamicObservableProps.tsx',
    'TestDynamicObservableComponent.tsx',
    'TestDynamicObservableChildren.tsx',
    'TestDynamicHeading.tsx',
    'TestDynamicFunctionProps.tsx',
    'TestDynamicStoreProps.tsx',
    'TestContextComponents.tsx',
    'TestContextHook.tsx',
    'TestContextDynamicContext.tsx',
    'TestComponentStaticRenderState.tsx',
    'TestComponentStaticRenderProps.tsx',
    'TestComponentStaticProps.tsx',
    'TestComponentStatic.tsx',
    'TestComponentObservableDirect.tsx',
    'TestComponentObservable.tsx',
    'TestComponentFunction.tsx',
    'TestCleanupInnerPortal.tsx',
    'TestCleanupInner.tsx',
    'TestClassStaticString.tsx',
    'TestClassStatic.tsx', // Already exists
    'TestClassRemovalString.tsx',
    'TestClassRemoval.tsx',
    'TestClassObservableString.tsx',
    'TestClassObservable.tsx',
    'TestClassNameStatic.tsx',
    'TestClassNameObservable.tsx',
    'TestClassNameFunction.tsx',
    'TestClassFunctionString.tsx',
    'TestClassFunction.tsx',
    'TestClassesObjectStoreMultiple.tsx',
    'TestClassesObjectStore.tsx',
    'TestClassesObjectRemovalMultiple.tsx',
    'TestClassesObjectRemoval.tsx',
    'TestClassesObjectObservableMultiple.tsx',
    'TestClassesObjectObservable.tsx',
    'TestClassesObjectFunctionMultiple.tsx',
    'TestClassesObjectFunction.tsx',
    'TestClassesObjectStaticMultiple.tsx',
    'TestClassesObjectStatic.tsx',
    'TestClassesObjectCleanup.tsx',
    'TestClassesArrayStoreMultiple.tsx',
    'TestClassesArrayStore.tsx',
    'TestClassesArrayStaticMultiple.tsx',
    'TestClassesArrayStatic.tsx',
    'TestClassesArrayRemovalMultiple.tsx',
    'TestClassesArrayRemoval.tsx',
    'TestClassesArrayObservableValue.tsx',
    'TestClassesArrayObservableMultiple.tsx',
    'TestClassesArrayObservable.tsx',
    'TestClassesArrayNestedStatic.tsx',
    'TestClassesArrayFunctionValue.tsx',
    'TestClassesArrayFunctionMultiple.tsx',
    'TestClassesArrayFunction.tsx',
    'TestClassesArrayCleanup.tsx',
    'TestChildrenSymbol.tsx',
    'TestChildrenBoolean.tsx',
    'TestChildren.tsx',
    'TestChildOverReexecution.tsx',
    'TestCheckboxIndeterminateToggle.tsx',
    'TestBooleanRemoval.tsx',
    'TestBigIntRemoval.tsx',
    'TestAttributeRemoval.tsx',
    'TestHTMLTextContentObservable.tsx',
    'TestHTMLTextContentFunction.tsx',
    'TestHTMLOuterHTMLStatic.tsx',
    'TestHTMLOuterHTMLObservable.tsx',
    'TestHTMLOuterHTMLFunction.tsx',
    'TestHTMLInnerHTMLStatic.tsx',
    'TestHTMLInnerHTMLObservable.tsx',
    'TestHTMLInnerHTMLFunction.tsx',
    'TestHTMLFunctionStaticRegistry.tsx',
    'TestHTMLFunctionStatic.tsx',
    'TestHTMLDangerouslySetInnerHTMLFunctionString.tsx',
    'TestHTMLDangerouslySetInnerHTMLObservableString.tsx',
    'TestHTMLDangerouslySetInnerHTMLObservable.tsx',
    'TestForFallbackFunction.tsx',
    'TestForFallbackObservable.tsx',
    'TestForFallbackObservableStatic.tsx',
    'TestForFallbackStatic.tsx',
    'TestForFunctionObservables.tsx',
    'TestForObservableObservables.tsx',
    'TestForObservables.tsx',
    'TestForObservablesStatic.tsx',
    'TestForRandom.tsx',
    'TestForRandomOnlyChild.tsx',
    'TestForStatic.tsx',
    'TestForUnkeyedFallbackFunction.tsx',
    'TestForUnkeyedFallbackObservable.tsx',
    'TestForUnkeyedFallbackObservableStatic.tsx',
    'TestForUnkeyedFallbackStatic.tsx',
    'TestForUnkeyedFunctionObservables.tsx',
    'TestForUnkeyedObservableObservables.tsx',
    'TestForUnkeyedObservables.tsx',
    'TestForUnkeyedObservablesStatic.tsx',
    'TestForUnkeyedRandom.tsx',
    'TestForUnkeyedRandomOnlyChild.tsx',
    'TestForUnkeyedStatic.tsx',
    'TestFragmentStatic.tsx',
    'TestFragmentStaticComponent.tsx',
    'TestFragmentStaticDeep.tsx',
    'TestEventClickAndClickCaptureStatic.tsx',
    'TestEventClickCaptureObservable.tsx',
    'TestEventClickCaptureRemoval.tsx',
    'TestEventClickCaptureStatic.tsx',
    'TestEventClickObservable.tsx',
    'TestEventClickRemoval.tsx',
    'TestEventClickStatic.tsx',
    'TestEventClickStopImmediatePropagation.tsx',
    'TestEventClickStopPropagation.tsx',
    'TestEventEnterAndEnterCaptureStatic.tsx',
    'TestEventEnterStopImmediatePropagation.tsx',
    'TestEventEnterStopPropagation.tsx',
    'TestEventMiddleClickCaptureStatic.tsx',
    'TestEventMiddleClickStatic.tsx',
    'TestEventTargetCurrentTarget.tsx',
    'TestDirectiveSingleArgument.tsx',
    'TestDirectiveRegisterLocal.tsx',
    'TestDirectiveRef.tsx',
    'TestDirective.tsx',
    'TestHTMLTextContentStatic.tsx'
];

// Template for static tests (no observable changes)
const staticTestTemplate = (componentName, title, elementContent) => `/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('${componentName} component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { h, render } = woby

        const element = h('div', null,
            h('h3', null, '${title}'),
            ${elementContent}
        )
        
        render(element, document.body)
    })

    // Add specific assertions here based on the component
})
`

// Template for observable tests (with manual triggers)
const observableTestTemplate = (componentName, title, observableSetup, elementContent, triggerLogic, assertions) => `/** @jsxImportSource woby */
import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test('${componentName} component', async ({ page }) => {
    const wobyScript = fs.readFileSync(path.join(__dirname, '../../../dist/index.umd.js'), 'utf8')
    await page.addScriptTag({ content: wobyScript })

    await page.evaluate(() => {
        const woby = (window as any).woby
        const { $, h, render } = woby

        ${observableSetup}
        
        const element = h('div', null,
            h('h3', null, '${title}'),
            ${elementContent}
        )
        
        render(element, document.body)
        
        // Define trigger function and attach to document body
        ${triggerLogic}
    })

    // Initial assertion
    ${assertions}

    // Manually trigger 4 times
    await page.evaluate(() => {
        (document.body as any)['trigger${componentName}']()
    })
    await page.waitForTimeout(50)
    // Add assertion

    await page.evaluate(() => {
        (document.body as any)['trigger${componentName}']()
    })
    await page.waitForTimeout(50)
    // Add assertion

    await page.evaluate(() => {
        (document.body as any)['trigger${componentName}']()
    })
    await page.waitForTimeout(50)
    // Add assertion

    await page.evaluate(() => {
        (document.body as any)['trigger${componentName}']()
    })
    await page.waitForTimeout(50)
    // Add assertion
})
`

// Generate files
console.log('Generating test files for', testFiles.length, 'components...')

testFiles.forEach(file => {
    const componentName = file.replace('.tsx', '')
    const testFileName = `${componentName}.spec.tsx`
    const testFilePath = path.join(__dirname, 'test.playwright', testFileName)

    // Check if file already exists
    if (fs.existsSync(testFilePath)) {
        console.log(`File ${testFileName} already exists, skipping...`)
        return
    }

    // For now, just create a basic static template for each file
    const title = componentName.replace(/([A-Z])/g, ' $1').trim()
    const content = `h('p', null, '${componentName}')`

    const template = staticTestTemplate(componentName, title, content)

    try {
        fs.writeFileSync(testFilePath, template)
        console.log(`Created: ${testFileName}`)
    } catch (err) {
        console.error(`Failed to create ${testFileName}:`, err)
    }
})

console.log('Generation complete!')