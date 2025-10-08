


import { isServer } from './methods/is_server'


if (!isServer()) {

    const isLoaded = !!globalThis.WOBY

    if (isLoaded) {

        throw new Error('Woby has already been loaded')

    } else {

        globalThis.WOBY = true

    }

}

