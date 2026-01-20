import { SurveyStatus } from '@/shared/types/surveys/survey.type'
import { z } from 'zod'

export const SurveyOverviewStatsSchema = z.object({
  totalResponses: z.number(),
  completedCount: z.number(),
  inProgressCount: z.number(),
  completionRate: z.number()
})

export const SurveyOverviewWeeklyDataSchema = z.object({
  date: z.string(),
  count: z.number()
})

export const SurveyOverviewWeeklyResponseSchema = z.object({
  data: z.array(SurveyOverviewWeeklyDataSchema)
})

export const SurveyOverviewResponseSchema = z.object({
  _id: z.string(),
  shortId: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  description: z.string().nullable(),
  status: z.enum([
    SurveyStatus.DRAFT,
    SurveyStatus.PUBLISHED,
    SurveyStatus.ARCHIVED
  ]),
  publishedAt: z.date().nullable(),
  archivedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  stats: SurveyOverviewStatsSchema,
  weeklyData: SurveyOverviewWeeklyResponseSchema,
  pageCount: z.number(),
  questionCount: z.number()
})

export type SurveyOverviewResponse = z.infer<
  typeof SurveyOverviewResponseSchema
>
