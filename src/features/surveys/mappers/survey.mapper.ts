import type { NodeId, ObjectId, ShortId } from '@/shared/types/brands.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import type { Survey } from '@/shared/types/surveys/survey.type'
import type { SurveyResponse } from '../../../shared/api/contracts/surveys/surveys.contract'

export const surveyMapper = {
  toDomain(survey: SurveyResponse): Survey {
    return {
      _id: survey._id as ObjectId,
      shortId: survey.shortId as ShortId,
      createdBy: survey.createdBy as ObjectId,
      title: survey.title,
      subtitle: survey.subtitle ?? undefined,
      description: survey.description ?? undefined,
      status: survey.status,
      pages: survey.pages.map(page => ({
        ...page,
        id: page.id as NodeId
      })) as PageNode[],
      createdAt: new Date(survey.createdAt),
      updatedAt: new Date(survey.updatedAt),
      publishedAt: survey.publishedAt ? new Date(survey.publishedAt) : null,
      archivedAt: survey.archivedAt ? new Date(survey.archivedAt) : null,
      responseCount: survey.responseCount
    }
  }
}
