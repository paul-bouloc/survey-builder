import { SurveyStatus } from '@/shared/types/surveys/survey.type'
import { z } from 'zod'

const PageNodeSchema = z.object({
  id: z.string(),
  kind: z.literal('page'),
  order: z.number(),
  title: z.string().nullable(),
  subtitle: z.string().nullable(),
  description: z.string().nullable(),
  code: z.string().nullable(),
  condition: z.any().nullable(),
  triggers: z.array(z.any()),
  children: z.array(z.any()),
  page: z.object({
    skippable: z.boolean()
  })
})

export const SurveySchema = z.object({
  _id: z.string(),
  shortId: z.string(),
  createdBy: z.string(),
  title: z.string(),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum([
    SurveyStatus.DRAFT,
    SurveyStatus.PUBLISHED,
    SurveyStatus.ARCHIVED
  ]),
  pages: z.array(PageNodeSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date().nullable(),
  archivedAt: z.date().nullable(),
  responseCount: z.number()
})

export type SurveyResponse = z.infer<typeof SurveySchema>

export const SurveysListResponseSchema = z.object({
  surveys: z.array(SurveySchema)
})

export type SurveysListResponse = z.infer<typeof SurveysListResponseSchema>
