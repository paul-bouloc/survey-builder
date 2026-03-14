import type { Node, NodeKind } from '@/shared/types/surveys/nodes/node.type'
import { NodeKind as NodeKindEnum } from '@/shared/types/surveys/nodes/node.type'
import type {
  QuestionNode,
  QuestionType
} from '@/shared/types/surveys/nodes/question.node.type'
import {
  type LucideIcon,
  AlignLeft,
  Calendar,
  CheckSquare,
  CircleDot,
  File,
  Folder,
  Hash,
  Info,
  List,
  MessageCircleQuestionMark,
  Minus,
  SlidersHorizontal,
  Type
} from 'lucide-react'
import * as React from 'react'

const NODE_KIND_ICONS: Record<NodeKind, LucideIcon> = {
  page: File,
  group: Folder,
  question: MessageCircleQuestionMark,
  info: Info,
  divider: Minus
}

const QUESTION_TYPE_ICONS: Record<QuestionType, LucideIcon> = {
  text: Type,
  textarea: AlignLeft,
  number: Hash,
  date: Calendar,
  radio: CircleDot,
  checkboxes: CheckSquare,
  select: List,
  scale: SlidersHorizontal
}

function getIconForNode(
  kind: NodeKind,
  questionType?: QuestionType
): LucideIcon {
  if (kind === NodeKindEnum.QUESTION && questionType !== undefined) {
    return QUESTION_TYPE_ICONS[questionType]
  }
  return NODE_KIND_ICONS[kind]
}

type SurveyEditorNodeKindIconProps =
  | { node: Node; className?: string }
  | { kind: NodeKind; questionType?: QuestionType; className?: string }

export function SurveyEditorNodeKindIcon(props: SurveyEditorNodeKindIconProps) {
  const className = 'className' in props ? props.className : undefined
  const kind = 'node' in props ? props.node.kind : props.kind
  const questionType =
    'node' in props
      ? props.node.kind === NodeKindEnum.QUESTION
        ? (props.node as QuestionNode).type
        : undefined
      : props.questionType

  const Icon = getIconForNode(kind, questionType)
  return React.createElement(Icon, { className })
}
