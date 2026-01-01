import { ObjectId, ShortId } from '@/shared/types/brands.type'
import { PageNode } from '@/shared/types/nodes/page-node.type'
import { SurveyStatus } from '@/shared/types/survey/survey-status.type'

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
