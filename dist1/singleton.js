/* IMPORT */
import isServer from './methods/is_server.js';
/* MAIN */
if (!isServer()) {
    const isLoaded = !!globalThis.VOBY;
    if (isLoaded) {
        throw new Error('Voby has already been loaded');
    }
    else {
        globalThis.VOBY = true;
    }
}
