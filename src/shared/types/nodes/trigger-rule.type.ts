import { Action } from '@/shared/types/nodes/action.type'
import { Condition } from '@/shared/types/nodes/condition/condition.type'

export const TriggerTiming = {
  CHANGE: 'change',
  COMMIT: 'commit',
  SUBMIT: 'submit',
  ENTER: 'enter',
  EXIT: 'exit'
} as const

export type TriggerTimingType =
  (typeof TriggerTiming)[keyof typeof TriggerTiming]

export interface TriggerRule {
  timing: TriggerTimingType
  /**
   * Condition of the trigger.
   * If omitted, always triggers on that timing.
   */
  when?: Condition
  actions: Action[]
  /**
   * Optional: avoid firing repeatedly (helpful for change timing).
   * Engine can store fired keys in memory or in response draft.
   */
  dedupeKey?: string
}
