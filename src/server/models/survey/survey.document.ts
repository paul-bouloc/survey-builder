import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import type { SurveyStatus } from '@/shared/types/surveys/survey.type'
import type { Document, Model, Types } from 'mongoose'

export interface ISurveyDocument extends Document {
  _id: Types.ObjectId
  shortId: string

  createdBy: Types.ObjectId

  title: string
  subtitle?: string
  description?: string

  status: SurveyStatus

  pages: PageNode[]

  publishedAt: Date | null
  archivedAt: Date | null
  responseCount: number

  createdAt: Date
  updatedAt: Date
}

export type SurveyModel = Model<ISurveyDocument>
