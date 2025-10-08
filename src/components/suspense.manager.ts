import { SuspenseContext } from '../components/suspense.context'
import { useCleanup } from '../hooks/soby'
import type { SuspenseData } from '../types'

export class SuspenseManager {

  /* VARIABLES */

  private suspenses = new Map<SuspenseData, number>();

  /* API */

  change = (suspense: SuspenseData, nr: number): void => {

    const counter = this.suspenses.get(suspense) || 0
    const counterNext = Math.max(0, counter + nr)

    if (counter === counterNext) return

    if (counterNext) {

      this.suspenses.set(suspense, counterNext)

    } else {

      this.suspenses.delete(suspense)

    }

    if (nr > 0) {

      suspense.increment(nr)

    } else {

      suspense.decrement(nr)

    }

  };

  suspend = (): void => {

    const suspense = SuspenseContext.get()

    if (!suspense) return

    this.change(suspense, 1)

    useCleanup(() => {

      this.change(suspense, -1)

    })

  };

  unsuspend = (): void => {

    this.suspenses.forEach((counter, suspense) => {

      this.change(suspense, - counter)

    })

  };

}