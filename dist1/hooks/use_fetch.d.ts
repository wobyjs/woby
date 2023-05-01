import type { FunctionMaybe, Resource } from '../types';
declare const useFetch: (request: FunctionMaybe<RequestInfo>, init?: FunctionMaybe<RequestInit>) => Resource<Response>;
export default useFetch;
