import { NodeId, ObjectId, ShortId } from '@/shared/types/brands.type'

export type ResponseStatus = 'in_progress' | 'completed'

/**
 * One response per user per survey.
 * On each step commit:
 * - overwrite the full `answers`
 * - update currentPageIndex/currentPageId
 * - update updatedAt
 * On submit:
 * - set status=completed
 * - set completedAt
 */
export interface SurveyResponse {
  _id: ObjectId

  surveyId: ObjectId
  surveyShortId: ShortId

  respondentUserId: ObjectId

  status: ResponseStatus
  currentPageId: NodeId

  answers: Record<NodeId, unknown>
  flags?: Record<string, boolean>

  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
}
