import { BaseNode } from '@/shared/types/nodes/node.type'
import { QuestionConfig } from '@/shared/types/nodes/question/question-config.type'
import { QuestionType } from '@/shared/types/nodes/question/question-type.type'

export interface QuestionNode extends BaseNode {
  kind: 'question'
  type: QuestionType
  required?: boolean

  /**
   * Where the answer will be stored (optional). If omitted, node.id is used.
   * This lets you store answers under stable keys if you want.
   */
  answerKey?: string

  /**
   * Config depends on question type
   */
  config: QuestionConfig

  /**
   * Optional children nodes for nested conditional questions.
   * Ex: "if YES, ask sub-question"
   */
  children?: Node[]
}
