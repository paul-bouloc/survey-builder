export const ConditionOperator = {
  EQUALS: 'eq',
  NOT_EQUALS: 'neq',
  IN: 'in',
  INCLUDES: 'includes',
  GREATER_THAN: 'gt',
  GREATER_THAN_OR_EQUALS: 'gte',
  LESS_THAN: 'lt',
  LESS_THAN_OR_EQUALS: 'lte',
  EXISTS: 'exists',
  AND: 'and',
  OR: 'or',
  NOT: 'not'
} as const

export type ConditionOperatorType =
  (typeof ConditionOperator)[keyof typeof ConditionOperator]

export type SimpleConditionOperatorType =
  | typeof ConditionOperator.EQUALS
  | typeof ConditionOperator.NOT_EQUALS
  | typeof ConditionOperator.IN
  | typeof ConditionOperator.INCLUDES
  | typeof ConditionOperator.GREATER_THAN
  | typeof ConditionOperator.GREATER_THAN_OR_EQUALS
  | typeof ConditionOperator.LESS_THAN
  | typeof ConditionOperator.LESS_THAN_OR_EQUALS

export type Condition =
  | {
      op: SimpleConditionOperatorType
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
