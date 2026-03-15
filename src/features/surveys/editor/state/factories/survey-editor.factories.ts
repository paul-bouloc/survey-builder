import type { NodeId } from '@/shared/types/brands.type'
import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import type { QuestionNode } from '@/shared/types/surveys/nodes/question.node.type'
import { QuestionType } from '@/shared/types/surveys/nodes/question.node.type'

export function createPageNode(order: number): PageNode {
  return {
    id: crypto.randomUUID() as NodeId,
    kind: NodeKind.PAGE,
    order,
    title: null,
    subtitle: null,
    description: null,
    code: null,
    condition: null,
    triggers: [],
    children: [],
    page: { skippable: false }
  }
}

/** Crée un node question simple (type texte) pour l'éditeur. */
export function createQuestionNode(order: number): QuestionNode {
  return {
    id: crypto.randomUUID() as NodeId,
    kind: NodeKind.QUESTION,
    order,
    title: null,
    subtitle: null,
    description: null,
    code: null,
    condition: null,
    triggers: [],
    type: QuestionType.TEXT,
    required: false,
    config: { type: 'text' }
  }
}
