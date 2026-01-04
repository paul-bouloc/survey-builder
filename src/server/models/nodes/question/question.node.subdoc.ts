import type { Node, NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type {
  QuestionConfig,
  QuestionType,
} from '@/shared/types/surveys/nodes/question.node.type'
import type { IBaseNodeSubdoc } from '../node'

export interface IQuestionNodeSubdoc extends IBaseNodeSubdoc {
  kind: typeof NodeKind.QUESTION
  type: QuestionType
  required?: boolean
  config: QuestionConfig
  children?: Node[]
}
