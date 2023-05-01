/* IMPORT */
import Portal from '../components/portal.js';
import Suspense from '../components/suspense.js';
import SuspenseContext from '../components/suspense.context.js';
import { SYMBOL_SUSPENSE } from '../constants.js';
import useReaction from '../hooks/use_reaction.js';
import useRoot from '../hooks/use_root.js';
import { context } from '../oby.js';
/* MAIN */
//TODO: Implement this properly, without relying on JSDOM or stuff like that
const renderToString = (child) => {
    return new Promise(resolve => {
        useRoot(dispose => {
            context(SYMBOL_SUSPENSE, undefined); // Ensuring the parent Suspense boundary, if any, is not triggered
            const suspense = SuspenseContext.new();
            const { portal } = Portal({ children: Suspense({ children: child }) }).metadata;
            useReaction(() => {
                if (suspense.active())
                    return;
                resolve(portal.innerHTML);
                dispose();
            });
        });
    });
};
/* EXPORT */
export default renderToString;
