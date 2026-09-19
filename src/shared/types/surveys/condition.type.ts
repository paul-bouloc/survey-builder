/* ------------------------------ CONDITIONS --------------------------------
 * Conditions are generic. They can reference:
 * - the current question value (default)
 * - any other answer by nodeId/answerKey via "path"
 * - derived/flags via "path"
 * -------------------------------------------------------------------------- */

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

/**
 * Opérateurs à valeur : ceux qui comparent une cible à une `value`.
 * Les exclure de la branche simple de `Condition` est ce qui rend l'union
 * réellement discriminée sur `op` — sinon `{ op: 'and', value }` la satisfait,
 * alors que le discriminator Mongoose le rejette.
 */
export type SimpleConditionOperatorType =
  | typeof ConditionOperator.EQUALS
  | typeof ConditionOperator.NOT_EQUALS
  | typeof ConditionOperator.IN
  | typeof ConditionOperator.INCLUDES
  | typeof ConditionOperator.GREATER_THAN
  | typeof ConditionOperator.GREATER_THAN_OR_EQUALS
  | typeof ConditionOperator.LESS_THAN
  | typeof ConditionOperator.LESS_THAN_OR_EQUALS

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
