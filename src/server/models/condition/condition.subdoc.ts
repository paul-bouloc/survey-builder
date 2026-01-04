import { ConditionOperator, ConditionOperatorType } from '@/shared/types/surveys/condition.type'

export interface IBaseConditionSubdoc {
  op: ConditionOperatorType
}

// Simple condition with op, path optional, value
// For: eq, neq, in, includes, gt, gte, lt, lte
export interface ISimpleConditionSubdoc extends IBaseConditionSubdoc {
  op:
    | typeof ConditionOperator.EQUALS
    | typeof ConditionOperator.NOT_EQUALS
    | typeof ConditionOperator.IN
    | typeof ConditionOperator.INCLUDES
    | typeof ConditionOperator.GREATER_THAN
    | typeof ConditionOperator.GREATER_THAN_OR_EQUALS
    | typeof ConditionOperator.LESS_THAN
    | typeof ConditionOperator.LESS_THAN_OR_EQUALS
  path?: string
  value: unknown
}

// Exists condition with op and path required
export interface IExistsConditionSubdoc extends IBaseConditionSubdoc {
  op: typeof ConditionOperator.EXISTS
  path: string
}

// Logical condition with op and conditions[]
export interface ILogicalConditionSubdoc extends IBaseConditionSubdoc {
  op: typeof ConditionOperator.AND | typeof ConditionOperator.OR
  conditions: ConditionSubdoc[]
}

// Not condition with op and condition
export interface INotConditionSubdoc extends IBaseConditionSubdoc {
  op: typeof ConditionOperator.NOT
  condition: ConditionSubdoc
}

export type ConditionSubdoc =
  | ISimpleConditionSubdoc
  | IExistsConditionSubdoc
  | ILogicalConditionSubdoc
  | INotConditionSubdoc

