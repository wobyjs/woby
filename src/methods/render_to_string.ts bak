

import { Portal } from '../components/portal'
import { SuspenseCollector } from '../components/suspense.collector'
import { useEffect } from '../hooks/soby'
import { useRoot } from '../hooks/soby'
import { $$ } from '../methods/soby'
import type { Child } from '../types'


//TODO: Implement this properly, without relying on JSDOM or stuff like that

export const renderToString = (child: Child): Promise<string> => {

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