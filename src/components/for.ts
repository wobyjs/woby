
/* IMPORT */

import { for as _for } from '../soby'
import type { Child, FunctionMaybe, Indexed, ObservableReadonly } from '../types'

/* MAIN */

function For<T>({ values, fallback, unkeyed, children }: { values: FunctionMaybe<readonly T[]>, fallback?: Child, unkeyed?: false, children: ((value: T, index: FunctionMaybe<number>) => Child) }): ObservableReadonly<Child>
function For<T>({ values, fallback, unkeyed, children }: { values: FunctionMaybe<readonly T[]>, fallback?: Child, unkeyed: true, children: ((value: Indexed<T>, index: FunctionMaybe<number>) => Child) }): ObservableReadonly<Child>
function For<T>({ values, fallback, unkeyed, children }: { values: FunctionMaybe<readonly T[]>, fallback?: Child, unkeyed?: boolean, children: ((value: T | Indexed<T>, index: FunctionMaybe<number>) => Child) }): ObservableReadonly<Child> {

    return _for(values, children, fallback, { unkeyed } as any) //TSC

}

/* EXPORT */

export default For