/* IMPORT */
import useMemo from '../hooks/use_memo.js';
import useResolved from '../hooks/use_resolved.js';
import useResource from '../hooks/use_resource.js';
import creatElement from './create_element.ssr.js';
import resolve from './resolve.js';
import { once } from '../utils/lang.js';
/* MAIN */
const lazy = (fetcher) => {
    const fetcherOnce = once(fetcher);
    const component = (props) => {
        const resource = useResource(fetcherOnce);
        return useMemo(() => {
            return useResolved(resource, ({ pending, error, value }) => {
                if (pending)
                    return;
                if (error)
                    throw error;
                const component = ('default' in value) ? value.default : value;
                return resolve(creatElement(component, props));
            });
        });
    };
    component.preload = () => {
        return new Promise((resolve, reject) => {
            const resource = useResource(fetcherOnce);
            useResolved(resource, ({ pending, error }) => {
                if (pending)
                    return;
                if (error)
                    return reject(error);
                return resolve();
            });
        });
    };
    return component;
};
/* EXPORT */
export default lazy;
