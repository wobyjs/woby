
/* IMPORT */

import { ternary } from '../soby'
import type { Child, FunctionMaybe, ObservableReadonly } from '../types'

/* MAIN */

const Ternary = ({ when, children }: { when: FunctionMaybe<unknown>, children: [Child, Child] }): ObservableReadonly<Child> => {

  return ternary(when, children[0], children[1])

}

/* EXPORT */

export default Ternary