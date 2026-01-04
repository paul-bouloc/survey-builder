import type { Action } from '@/shared/types/surveys/action.type'
import type { Condition } from '@/shared/types/surveys/condition.type'
import type { TriggerTimingType } from '@/shared/types/surveys/trigger.type'

export interface ITriggerRuleSubdoc {
  timing: TriggerTimingType
  when?: Condition
  actions: Action[]
  dedupeKey?: string
}
