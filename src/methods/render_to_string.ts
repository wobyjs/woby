
/* IMPORT */

import Portal from '../components/portal'
import SuspenseCollector from '../components/suspense.collector'
import useEffect from '../hooks/use_effect'
import useRoot from '../hooks/use_root'
import $$ from '../methods/SS'
import type { Child } from '../types'

/* MAIN */

//TODO: Implement this properly, without relying on JSDOM or stuff like that

const renderToString = (child: Child): Promise<string> => {

  return new Promise(resolve => {

    useRoot((stack, dispose) => {

      $$(SuspenseCollector.wrap(suspenses => {

        const { portal } = Portal({ children: child }).metadata

        useEffect((stack) => {

          if (suspenses.active()) return

          resolve(portal.innerHTML)

          dispose(stack)

        }, { suspense: false, stack: stack })

      }))

    })

  })

}

/* EXPORT */

export default renderToString