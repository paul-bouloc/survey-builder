export const SurveyStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const

export type SurveyStatus = (typeof SurveyStatus)[keyof typeof SurveyStatus]
