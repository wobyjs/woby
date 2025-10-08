
import { useResource } from '../hooks/use_resource'
import { $$ } from '../methods/soby'
import type { FunctionMaybe, Resource } from '../types'


export const usePromise = <T>(promise: FunctionMaybe<Promise<T>>): Resource<T> => {

  return useResource(() => $$(promise))

}