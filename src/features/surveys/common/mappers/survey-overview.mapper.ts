import type { SurveyOverviewResponse } from '@/shared/api/contracts/surveys/surveys.contract'
import type { ObjectId, ShortId } from '@/shared/types/brands.type'
import type { SurveyOverview } from '@/shared/types/surveys/survey-overview.type'

export const surveyOverviewMapper = {
  toDomain(overview: SurveyOverviewResponse): SurveyOverview {
    return {
      _id: overview._id as ObjectId,
      shortId: overview.shortId as ShortId,
      title: overview.title,
      subtitle: overview.subtitle,
      description: overview.description,
      status: overview.status,
      createdAt: new Date(overview.createdAt),
      updatedAt: new Date(overview.updatedAt),
      publishedAt: overview.publishedAt ? new Date(overview.publishedAt) : null,
      archivedAt: overview.archivedAt ? new Date(overview.archivedAt) : null,
      stats: overview.stats,
      weeklyData: overview.weeklyData,
      pageCount: overview.pageCount,
      questionCount: overview.questionCount
    }
  }
}
