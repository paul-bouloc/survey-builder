import type { NodeId } from '@/shared/types/brands.type'
import type { TriggerRule } from '@/shared/types/surveys/trigger.type'
import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { DividerNode } from '@/shared/types/surveys/nodes/divider.node.type'
import type { GroupNode } from '@/shared/types/surveys/nodes/group.node.type'
import type { InfoNode } from '@/shared/types/surveys/nodes/info.node.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import type { QuestionNode } from '@/shared/types/surveys/nodes/question.node.type'
import {
  QuestionType,
  type TextQuestionNode,
  type TextareaQuestionNode,
  type NumberQuestionNode,
  type DateQuestionNode,
  type RadioQuestionNode,
  type CheckboxesQuestionNode,
  type SelectQuestionNode,
  type ScaleQuestionNode
} from '@/shared/types/surveys/nodes/question.node.type'

const baseNodeFields = (order: number) => ({
  id: crypto.randomUUID() as NodeId,
  order,
  title: null,
  subtitle: null,
  description: null,
  code: null,
  condition: null,
  triggers: [] as TriggerRule[]
})

export function createPageNode(order: number): PageNode {
  return {
    ...baseNodeFields(order),
    kind: NodeKind.PAGE,
    children: [],
    page: { skippable: false }
  }
}

export function createGroupNode(order: number): GroupNode {
  return {
    ...baseNodeFields(order),
    kind: NodeKind.GROUP,
    children: [],
    group: { title: '', description: '' }
  }
}

export function createInfoNode(order: number): InfoNode {
  return {
    ...baseNodeFields(order),
    kind: NodeKind.INFO,
    info: {
      type: 'info',
      title: '',
      description: ''
    }
  }
}

export function createDividerNode(order: number): DividerNode {
  return {
    ...baseNodeFields(order),
    kind: NodeKind.DIVIDER
  }
}

function createBaseQuestionNode(order: number) {
  return {
    ...baseNodeFields(order),
    kind: NodeKind.QUESTION,
    required: false
  }
}

export function createQuestionNodeByType(
  order: number,
  questionType: (typeof QuestionType)[keyof typeof QuestionType]
): QuestionNode {
  const base = createBaseQuestionNode(order)
  switch (questionType) {
    case QuestionType.TEXT: {
      const node: TextQuestionNode = {
        ...base,
        type: QuestionType.TEXT,
        config: { type: 'text' }
      }
      return node
    }
    case QuestionType.TEXTAREA: {
      const node: TextareaQuestionNode = {
        ...base,
        type: QuestionType.TEXTAREA,
        config: { type: 'textarea' }
      }
      return node
    }
    case QuestionType.NUMBER: {
      const node: NumberQuestionNode = {
        ...base,
        type: QuestionType.NUMBER,
        config: { type: 'number' }
      }
      return node
    }
    case QuestionType.DATE: {
      const node: DateQuestionNode = {
        ...base,
        type: QuestionType.DATE,
        config: { type: 'date' }
      }
      return node
    }
    case QuestionType.RADIO: {
      const node: RadioQuestionNode = {
        ...base,
        type: QuestionType.RADIO,
        config: { type: 'radio', options: [] }
      }
      return node
    }
    case QuestionType.CHECKBOXES: {
      const node: CheckboxesQuestionNode = {
        ...base,
        type: QuestionType.CHECKBOXES,
        config: { type: 'checkboxes', options: [] }
      }
      return node
    }
    case QuestionType.SELECT: {
      const node: SelectQuestionNode = {
        ...base,
        type: QuestionType.SELECT,
        config: { type: 'select', options: [] }
      }
      return node
    }
    case QuestionType.SCALE: {
      const node: ScaleQuestionNode = {
        ...base,
        type: QuestionType.SCALE,
        config: { type: 'scale', min: 0, max: 10 }
      }
      return node
    }
    default: {
      const node: TextQuestionNode = {
        ...base,
        type: QuestionType.TEXT,
        config: { type: 'text' }
      }
      return node
    }
  }
}

/** Crée un node question de type texte (rétrocompat). */
export function createQuestionNode(order: number): QuestionNode {
  return createQuestionNodeByType(order, QuestionType.TEXT)
}
