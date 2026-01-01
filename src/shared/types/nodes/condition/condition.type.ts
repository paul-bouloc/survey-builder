/* ------------------------------ CONDITIONS --------------------------------
 * Conditions are generic. They can reference:
 * - the current question value (default)
 * - any other answer by nodeId/answerKey via "path"
 * - derived/flags via "path"
 * -------------------------------------------------------------------------- */

import {
  ConditionOperator,
  ConditionOperatorType
} from '@/shared/types/nodes/condition/condition-operator.type'

/**
 * If "path" is omitted, the engine may interpret the condition against
 * the current question value. If provided, it references context.
 *
 * Path convention suggestion:
 * - answers.<nodeId or answerKey>
 * - flags.<name>
 * - derived.<name>
 */
export type Condition =
  | {
      op: ConditionOperatorType
      path?: string
      value: unknown
    }
  | {
      op: typeof ConditionOperator.EXISTS
      path: string
    }
  | {
      op: typeof ConditionOperator.AND | typeof ConditionOperator.OR
      conditions: Condition[]
    }
  | {
      op: typeof ConditionOperator.NOT
      condition: Condition
    }
