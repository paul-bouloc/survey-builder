import { ObjectId, ShortId } from '@/shared/types/brands.type'
import { PageNode } from '@/shared/types/surveys/nodes/page.node.type'

export const SurveyStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const

export type SurveyStatus = (typeof SurveyStatus)[keyof typeof SurveyStatus]

export interface Survey {
  _id: ObjectId
  shortId: ShortId

  createdBy: ObjectId

  title: string
  subtitle?: string
  description?: string

  status: SurveyStatus

  pages: PageNode[]
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  archivedAt: Date | null
  responseCount: number
}
