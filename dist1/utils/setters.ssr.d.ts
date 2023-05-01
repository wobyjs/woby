import type { Child, Classes, FunctionMaybe, Ref } from '../types';
declare const setChildStatic: (props: {
    children: any;
}, child: Child, dynamic?: boolean) => void;
declare const setChild: (props: {
    children: any;
}, child: Child) => void;
declare const setClassStatic: <T extends {
    className: string;
    classList: any;
}, K extends keyof T, V extends T[K]>(props: T, classes: string, force: boolean) => void;
declare const setClass: (props: any, key: string, value: FunctionMaybe<null | undefined | boolean>) => void;
declare const setClassBooleanStatic: <T>(props: T & {
    className: string;
    classList: any;
}, value: boolean, key: null | undefined | boolean | string, keyPrev?: null | undefined | boolean | string) => void;
declare const setClassesStatic: <T extends {
    children: any;
}, V>(props: T, key: string, object: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>, objectPrev?: null | undefined | string | FunctionMaybe<null | undefined | boolean | string>[] | Record<string, FunctionMaybe<null | undefined | boolean>>) => void;
declare const setClasses: <T extends {
    children: any;
}, V>(props: T, key: string, object: Classes) => void;
declare const setHTMLStatic: (props: any, value: null | undefined | number | string) => void;
declare const setHTML: (props: any, value: FunctionMaybe<{
    __html: FunctionMaybe<null | undefined | number | string>;
}>) => void;
/**
 *
 * @param props
 * @param key
 * @param value
 */
declare const setPropertyStatic: <T, V>(props: T, key: string, value: V) => void;
declare const setProperty: <T, V>(props: T, key: string, value: FunctionMaybe<null | undefined | boolean | number | string>) => void;
declare const setRef: <T>(element: T, value: Ref<T> | Ref<T>[]) => void;
declare const setStyleStatic: <S, T extends {
    style: S;
}, V>(props: T, key: string, value: V) => void;
declare const setStyle: <T extends {
    style: any;
}, K extends keyof T, V extends T[K]>(props: T, key: string, value: FunctionMaybe<V>) => void;
declare const setStylesStatic: <S extends {
    cssText: string;
}, T extends {
    style: string | S;
}, K extends keyof T, V extends T[K]>(props: T, object: null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>, objectPrev?: null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>) => void;
declare const setStyles: <T, V>(props: T, object: FunctionMaybe<null | undefined | string | Record<string, FunctionMaybe<null | undefined | number | string>>>) => void;
declare const setProp: <T extends {
    children: any;
}, V>(props: T, key: string, value: V) => void;
declare const setProps: (props: any, object: Record<string, unknown>) => void;
export { /* setAttributeStatic, setAttribute, setChildReplacementFunction, */ /* setChildReplacementText, setChildReplacement, */ setChildStatic, setChild, setClassStatic, setClass, setClassBooleanStatic, setClassesStatic, setClasses, /* setEventStatic, setEvent,  */ setHTMLStatic, setHTML, setPropertyStatic, setProperty, setRef, setStyleStatic, setStyle, setStylesStatic, setStyles, /* setTemplateAccessor, */ setProp, setProps };
