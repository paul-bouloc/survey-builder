import { createEndpoint } from '@/server/api/create-endpoint'
import { Survey } from '@/server/models'
import { SurveysListResponseSchema } from '@/shared/api/contracts/surveys.contract'

export const getSurveys = createEndpoint(
  {
    requireAuth: true,
    response: SurveysListResponseSchema
  },
  async ({ req }) => {
    if (!req.user) {
      throw new Error('User not found in request')
    }

    const { user } = req

    const surveys = await Survey.find({ createdBy: user._id })
      .sort({ updatedAt: -1 })
      .lean()

    const surveysResponse = surveys.map(survey => ({
      _id: survey._id.toString(),
      shortId: survey.shortId,
      createdBy: survey.createdBy.toString(),
      title: survey.title,
      subtitle: survey.subtitle ?? null,
      description: survey.description ?? null,
      status: survey.status,
      pages: survey.pages,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
      publishedAt: survey.publishedAt ?? null,
      archivedAt: survey.archivedAt ?? null,
      responseCount: survey.responseCount
    }))

    return {
      surveys: surveysResponse
    }
  }
)
