/**
 * Type definition for MutationCallback
 */

import type { MutationRecord } from './mutation_record'
import type { MutationObserver } from './mutation_observer'

export type MutationCallback = (mutations: MutationRecord[], observer: MutationObserver) => void