import type { LazyFetcher, LazyResult } from '../types';
declare const lazy: <P = {}>(fetcher: LazyFetcher<P>) => LazyResult<P>;
export default lazy;
