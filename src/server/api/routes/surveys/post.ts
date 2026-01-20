import { createEndpoint } from '@/server/api/create-endpoint'
import { Survey } from '@/server/models'
import {
  CreateSurveyBodySchema,
  SurveySchema
} from '@/shared/api/contracts/surveys/surveys.contract'

export const postSurvey = createEndpoint(
  {
    requireAuth: true,
    body: CreateSurveyBodySchema,
    response: SurveySchema,
    status: 201
  },
  async ({ body, user }) => {
    const survey = await Survey.create({
      createdBy: user._id,
      title: body.title,
      subtitle: body.subtitle,
      description: body.description
    })

    return {
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
    }
  }
)
