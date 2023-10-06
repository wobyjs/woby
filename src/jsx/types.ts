
/* IMPORT */
//console.log('ssr.ts')

// import './jsx/types'
//  * from './jsx/jsx'
//  * from './jsx/types.ts'
// import type { Context, Directive, DirectiveOptions, FunctionMaybe, Observable, ObservableReadonly, ObservableMaybe, ObservableOptions, Resource, StoreOptions, Component } from './types';

/*  */

//  * from './components/index.ssr';
//  * from './jsx/jsx-runtime.ssr'
//  * from './hooks';
//  * from './methods/index.ssr';
//  type { Context, Directive, DirectiveOptions, FunctionMaybe, Observable, ObservableReadonly, ObservableMaybe, ObservableOptions, Resource, StoreOptions, Component };
//  * from './constants';

//  { render } from './methods/render.testing'
export { }

import * as J from '../types'
import { FunctionMaybe, ArrayMaybe, ObservableMaybe } from '../types'

declare global {
  module JSX {
    type ArrayMaybe<T> = J.ArrayMaybe<T>
    type Callback = J.Callback
    type Child = J.Child
    type ChildWithMetadata<T> = J.ChildWithMetadata<T>
    type Classes = J.Classes
    type ComponentFunction<P> = J.ComponentFunction<P>
    type ComponentIntrinsicElement = J.ComponentIntrinsicElement
    type ComponentNode = J.ComponentNode
    type Component<P> = J.Component<P>
    type ComponentsMap = J.ComponentsMap
    type Constructor<T> = J.Constructor<T>
    type ConstructorWith<T> = J.ConstructorWith<T>
    type ContextData<T> = J.ContextData<T>
    type ContextProvider<T> = J.ContextProvider<T>
    type Context<T> = J.Context<T>
    type ContextWithDefault<T> = J.ContextWithDefault<T>
    type DirectiveFunction<Arguments extends unknown[] = []> = J.DirectiveFunction<Arguments>
    type DirectiveProvider = J.DirectiveProvider
    type DirectiveRef<Arguments extends unknown[] = []> = J.DirectiveRef<Arguments>
    type DirectiveRegister = J.DirectiveRegister
    type Directive<Arguments extends unknown[] = []> = J.Directive<Arguments>
    type DirectiveData<Arguments extends unknown[] = []> = J.DirectiveData<Arguments>
    type DirectiveOptions = J.DirectiveOptions
    type Disposer = J.Disposer
    type EffectFunction = J.EffectFunction
    type EffectOptions = J.EffectOptions
    type Element = J.Element
    type ExtractArray<T> = J.ExtractArray<T>
    type EventListener = J.EventListener
    type Falsy<T> = J.Falsy<T>
    type ForOptions = J.ForOptions
    type FN<Arguments extends unknown[], Return extends unknown = void> = J.FN<Arguments, Return>
    type FragmentUndefined = J.FragmentUndefined
    type FragmentNode = J.FragmentNode
    type FragmentFragment = J.FragmentFragment
    type FragmentNodes = J.FragmentNodes
    type FragmentFragments = J.FragmentFragments
    type FragmentMixed = J.FragmentMixed
    type Fragment = J.Fragment
    type FunctionMaybe<T = unknown> = J.FunctionMaybe<T>
    type Indexed<T = unknown> = J.Indexed<T>
    type LazyComponent<P = {}> = J.LazyComponent<P>
    type LazyFetcher<P = {}> = J.LazyFetcher<P>
    type LazyResult<P = {}> = J.LazyResult<P>
    type MemoOptions<T = unknown> = J.MemoOptions<T>
    type Observable<T = unknown> = J.Observable<T>
    type ObservableLike<T = unknown> = J.ObservableLike<T>
    type ObservableReadonly<T = unknown> = J.ObservableReadonly<T>
    type ObservableReadonlyLike<T = unknown> = J.ObservableReadonlyLike<T>
    type ObservableMaybe<T = unknown> = J.ObservableMaybe<T>
    type ObservableOptions<T = unknown> = J.ObservableOptions<T>
    type PromiseMaybe<T = unknown> = J.PromiseMaybe<T>
    type Props = J.Props
    type Ref<T = unknown> = J.Ref<T>
    type ResourceStaticPending<T = unknown> = J.ResourceStaticPending<T>
    type ResourceStaticRejected = J.ResourceStaticRejected;
    type ResourceStaticResolved<T = unknown> = J.ResourceStaticResolved<T>;
    type ResourceStatic<T = unknown> = J.ResourceStatic<T>;
    type ResourceFunction<T = unknown> = J.ResourceFunction<T>;
    type Resource<T = unknown> = J.Resource<T>;
    type StoreOptions = J.StoreOptions;
    type SuspenseCollectorData = J.SuspenseCollectorData;
    type SuspenseData = J.SuspenseData;
    type TemplateActionPath = J.TemplateActionPath;
    type TemplateActionProxy = J.TemplateActionProxy;
    type TemplateActionWithNodes = J.TemplateActionWithNodes;
    type TemplateActionWithPaths = J.TemplateActionWithPaths;
    type TemplateVariableProperties = J.TemplateVariableProperties;
    type TemplateVariableData = J.TemplateVariableData;
    type TemplateVariablesMap = J.TemplateVariablesMap;
    type Truthy<T = unknown> = J.Truthy<T>;
    type CSSProperties = J.CSSProperties

    /* MAIN */

    type Nullable<T = unknown> = J.Nullable<T>;
    type AllClassProperties = J.AllClassProperties;
    type DOMCSSProperties = J.DOMCSSProperties;
    type DOMCSSVariables = J.DOMCSSVariables;
    type HTMLAttributeReferrerPolicy = J.HTMLAttributeReferrerPolicy;
    type Children = J.Child;
    type Class = J.FunctionMaybe<Nullable<string | J.ClassProperties | ( J.FunctionMaybe<null | undefined | boolean | string> | J.Class )[]>>;
    type Refs<T = unknown> = J.Refs<T>;
    type Style = J.FunctionMaybe<Nullable<string | J.StyleProperties>>;
    type IntrinsicElement<T extends keyof J.IntrinsicElements> = J.IntrinsicElements[ T ];
    type ClassProperties = J.ClassProperties

    type StyleProperties = J.StyleProperties
    type TargetedEvent<T extends EventTarget = EventTarget, TypedEvent extends Event = Event> = J.TargetedEvent<T, TypedEvent>;
    type TargetedAnimationEvent<T extends EventTarget> = J.TargetedAnimationEvent<T>;
    type TargetedClipboardEvent<T extends EventTarget> = J.TargetedClipboardEvent<T>;
    type TargetedChangeEvent<T extends EventTarget> = J.TargetedChangeEvent<T>;
    type TargetedCompositionEvent<T extends EventTarget> = J.TargetedCompositionEvent<T>;
    type TargetedDragEvent<T extends EventTarget> = J.TargetedDragEvent<T>;
    type TargetedFocusEvent<T extends EventTarget> = J.TargetedFocusEvent<T>;
    type TargetedInputEvent<T extends EventTarget> = J.TargetedInputEvent<T>;
    type TargetedKeyboardEvent<T extends EventTarget> = J.TargetedKeyboardEvent<T>;
    type TargetedMouseEvent<T extends EventTarget> = J.TargetedMouseEvent<T>;
    type TargetedPointerEvent<T extends EventTarget> = J.TargetedPointerEvent<T>;
    type TargetedSubmitEvent<T extends EventTarget> = J.TargetedSubmitEvent<T>;
    type TargetedTouchEvent<T extends EventTarget> = J.TargetedTouchEvent<T>;
    type TargetedTransitionEvent<T extends EventTarget> = J.TargetedTransitionEvent<T>;
    type TargetedUIEvent<T extends EventTarget> = J.TargetedUIEvent<T>;
    type TargetedWheelEvent<T extends EventTarget> = J.TargetedWheelEvent<T>;

    type EventHandler<Event extends TargetedEvent> = J.EventHandler<Event>;
    type AnimationEventHandler<T extends EventTarget> = J.AnimationEventHandler<T>;
    type ClipboardEventHandler<T extends EventTarget> = J.ClipboardEventHandler<T>;
    type ChangeEventHandler<T extends EventTarget> = J.ChangeEventHandler<T>;
    type CompositionEventHandler<T extends EventTarget> = J.CompositionEventHandler<T>;
    type DragEventHandler<T extends EventTarget> = J.DragEventHandler<T>;
    type FocusEventHandler<T extends EventTarget> = J.FocusEventHandler<T>;
    type GenericEventHandler<T extends EventTarget> = J.GenericEventHandler<T>;
    type InputEventHandler<T extends EventTarget> = J.InputEventHandler<T>;
    type KeyboardEventHandler<T extends EventTarget> = J.KeyboardEventHandler<T>;
    type MouseEventHandler<T extends EventTarget> = J.MouseEventHandler<T>;
    type PointerEventHandler<T extends EventTarget> = J.PointerEventHandler<T>;
    type SubmitEventHandler<T extends EventTarget> = J.SubmitEventHandler<T>;
    type TouchEventHandler<T extends EventTarget> = J.TouchEventHandler<T>;
    type TransitionEventHandler<T extends EventTarget> = J.TransitionEventHandler<T>;
    type UIEventHandler<T extends EventTarget> = J.UIEventHandler<T>;
    type WheelEventHandler<T extends EventTarget> = J.WheelEventHandler<T>;

    type ElementAttributesProperty = J.ElementAttributesProperty;
    type ElementChildrenAttribute = J.ElementChildrenAttribute;
    type IntrinsicAttributes = J.IntrinsicAttributes;
    type AriaAttributes = J.AriaAttributes;
    type Directives = J.Directives;
    type DirectiveAttributes = J.DirectiveAttributes;
    type EventAttributes<T extends EventTarget> = J.EventAttributes<T>;
    type ViewAttributes = J.ViewAttributes;
    type DOMAttributes<T extends EventTarget> = J.DOMAttributes<T>;
    type VoidHTMLAttributes<T extends EventTarget> = J.VoidHTMLAttributes<T>;
    type HTMLAttributes<T extends EventTarget> = J.VoidHTMLAttributes<T> & ViewAttributes;
    type SVGAttributes<T extends EventTarget = SVGElement> = J.HTMLAttributes<T> & DirectiveAttributes;
    type AnchorHTMLAttributes<T extends EventTarget> = J.HTMLAttributes<T>;
    type AudioHTMLAttributes<T extends EventTarget> = J.MediaHTMLAttributes<T>;
    type AreaHTMLAttributes<T extends EventTarget> = J.VoidHTMLAttributes<T>;
    type BaseHTMLAttributes<T extends EventTarget> = J.VoidHTMLAttributes<T>;
    type BlockquoteHTMLAttributes<T extends EventTarget> = J.HTMLAttributes<T>;
    type BrHTMLAttributes<T extends EventTarget> = J.BrHTMLAttributes<T>
    type ButtonHTMLAttributes<T extends EventTarget> = J.ButtonHTMLAttributes<T>
    type CanvasHTMLAttributes<T extends EventTarget> = J.CanvasHTMLAttributes<T>
    type ColHTMLAttributes<T extends EventTarget> = J.ColHTMLAttributes<T>
    type ColgroupHTMLAttributes<T extends EventTarget> = J.ColgroupHTMLAttributes<T>
    type DataHTMLAttributes<T extends EventTarget> = J.DataHTMLAttributes<T>
    type DetailsHTMLAttributes<T extends EventTarget> = J.DetailsHTMLAttributes<T>
    type DelHTMLAttributes<T extends EventTarget> = J.DelHTMLAttributes<T>
    type DialogHTMLAttributes<T extends EventTarget> = J.DialogHTMLAttributes<T>
    type EmbedHTMLAttributes<T extends EventTarget> = J.EmbedHTMLAttributes<T>
    type FieldsetHTMLAttributes<T extends EventTarget> = J.FieldsetHTMLAttributes<T>
    type FormHTMLAttributes<T extends EventTarget> = J.FormHTMLAttributes<T>
    type HrHTMLAttributes<T extends EventTarget> = J.HrHTMLAttributes<T>
    type HtmlHTMLAttributes<T extends EventTarget> = J.HtmlHTMLAttributes<T>
    type IframeHTMLAttributes<T extends EventTarget> = J.IframeHTMLAttributes<T>
    type ImgHTMLAttributes<T extends EventTarget> = J.ImgHTMLAttributes<T>
    type InsHTMLAttributes<T extends EventTarget> = J.InsHTMLAttributes<T>
    type InputHTMLAttributes<T extends EventTarget> = J.InputHTMLAttributes<T>
    type KeygenHTMLAttributes<T extends EventTarget> = J.KeygenHTMLAttributes<T>
    type LabelHTMLAttributes<T extends EventTarget> = J.LabelHTMLAttributes<T>
    type LiHTMLAttributes<T extends EventTarget> = J.LiHTMLAttributes<T>
    type LinkHTMLAttributes<T extends EventTarget> = J.LinkHTMLAttributes<T>
    type MapHTMLAttributes<T extends EventTarget> = J.MapHTMLAttributes<T>
    type MenuHTMLAttributes<T extends EventTarget> = J.MenuHTMLAttributes<T>
    type MediaHTMLAttributes<T extends EventTarget> = J.MediaHTMLAttributes<T>
    type MetaHTMLAttributes<T extends EventTarget> = J.MetaHTMLAttributes<T>
    type MeterHTMLAttributes<T extends EventTarget> = J.MeterHTMLAttributes<T>
    type QuoteHTMLAttributes<T extends EventTarget> = J.QuoteHTMLAttributes<T>
    type ObjectHTMLAttributes<T extends EventTarget> = J.ObjectHTMLAttributes<T>
    type OlHTMLAttributes<T extends EventTarget> = J.OlHTMLAttributes<T>
    type OptgroupHTMLAttributes<T extends EventTarget> = J.OptgroupHTMLAttributes<T>
    type OptionHTMLAttributes<T extends EventTarget> = J.OptionHTMLAttributes<T>
    type OutputHTMLAttributes<T extends EventTarget> = J.OutputHTMLAttributes<T>
    type ParamHTMLAttributes<T extends EventTarget> = J.ParamHTMLAttributes<T>
    type ProgressHTMLAttributes<T extends EventTarget> = J.ProgressHTMLAttributes<T>
    type SlotHTMLAttributes<T extends EventTarget> = J.SlotHTMLAttributes<T>
    type ScriptHTMLAttributes<T extends EventTarget> = J.ScriptHTMLAttributes<T>
    type SelectHTMLAttributes<T extends EventTarget> = J.SelectHTMLAttributes<T>
    type SourceHTMLAttributes<T extends EventTarget> = J.SourceHTMLAttributes<T>
    type StyleHTMLAttributes<T extends EventTarget> = J.StyleHTMLAttributes<T>
    type TableHTMLAttributes<T extends EventTarget> = J.TableHTMLAttributes<T>
    type TextareaHTMLAttributes<T extends EventTarget> = J.TextareaHTMLAttributes<T>
    type TdHTMLAttributes<T extends EventTarget> = J.TdHTMLAttributes<T>
    type ThHTMLAttributes<T extends EventTarget> = J.ThHTMLAttributes<T>
    type TimeHTMLAttributes<T extends EventTarget> = J.TimeHTMLAttributes<T>
    type TrackHTMLAttributes<T extends EventTarget> = J.TrackHTMLAttributes<T>
    type VideoHTMLAttributes<T extends EventTarget> = J.VideoHTMLAttributes<T>
    type WbrHTMLAttributes<T extends EventTarget> = J.WbrHTMLAttributes<T>
    type WebViewHTMLAttributes<T extends EventTarget> = J.WebViewHTMLAttributes<T>
    type IntrinsicElementsMap = J.IntrinsicElementsMap
    type IntrinsicElements = J.IntrinsicElements 
  }

}
