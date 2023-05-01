/* IMPORT */
import SuspenseManager from '../components/suspense.manager.js';
import useDisposed from './use_disposed.js';
import useReaction from './use_reaction.js';
import useReadonly from './use_readonly.js';
import $ from '../methods/S.js';
import $$ from '../methods/SS.js';
import batch from '../methods/batch.js';
import { assign, castError, isPromise } from '../utils/lang.js';
/* MAIN */
//TODO: Option for returning the resource as a store, where also the returned value gets wrapped in a store
//FIXME: SSR demo: toggling back and forth between /home and /loader is buggy, /loader gets loaded with no data, which is wrong
const useResource = (fetcher) => {
    const pending = $(true);
    const error = $();
    const value = $();
    const latest = $();
    const { suspend, unsuspend } = new SuspenseManager();
    const resourcePending = { pending: true, get value() { return void suspend(); }, get latest() { return latest() ?? void suspend(); } };
    const resourceRejected = { pending: false, get error() { return error(); }, get value() { throw error(); }, get latest() { throw error(); } };
    const resourceResolved = { pending: false, get value() { return value(); }, get latest() { return value(); } };
    const resourceFunction = { pending: () => pending(), error: () => error(), value: () => resource().value, latest: () => resource().latest };
    const resource = $(resourcePending);
    useReaction(() => {
        const disposed = useDisposed();
        const onPending = () => {
            batch(() => {
                pending(true);
                error(undefined);
                value(undefined);
                resource(resourcePending);
            });
        };
        const onResolve = (result) => {
            if (disposed())
                return;
            batch(() => {
                pending(false);
                error(undefined);
                value(() => result);
                latest(() => result);
                resource(resourceResolved);
            });
        };
        const onReject = (exception) => {
            if (disposed())
                return;
            batch(() => {
                pending(false);
                error(castError(exception));
                value(undefined);
                latest(undefined);
                resource(resourceRejected);
            });
        };
        const fetch = () => {
            try {
                const value = $$(fetcher());
                if (isPromise(value)) {
                    onPending();
                    value.then(onResolve, onReject);
                    value.then(unsuspend, unsuspend);
                }
                else {
                    onResolve(value);
                }
            }
            catch (error) {
                onReject(error);
            }
        };
        fetch();
    });
    return assign(useReadonly(resource), resourceFunction);
};
/* EXPORT */
export default useResource;
