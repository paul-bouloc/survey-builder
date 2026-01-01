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
