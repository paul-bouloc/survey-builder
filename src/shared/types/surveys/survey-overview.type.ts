import { ObjectId, ShortId } from '@/shared/types/brands.type'
import { SurveyStatus } from '@/shared/types/surveys/survey.type'

export interface SurveyOverviewStats {
  totalResponses: number
  completedCount: number
  inProgressCount: number
  completionRate: number
}

export interface SurveyOverviewWeeklyPoint {
  date: string
  count: number
}

export interface SurveyOverview {
  _id: ObjectId
  shortId: ShortId

  title: string
  subtitle: string | null
  description: string | null

  status: SurveyStatus

  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
  archivedAt: Date | null

  stats: SurveyOverviewStats
  weeklyData: { data: SurveyOverviewWeeklyPoint[] }
  pageCount: number
  questionCount: number
}
